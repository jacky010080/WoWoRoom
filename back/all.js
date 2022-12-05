const api_path = "jacky010080";
const token = "DMnVPoozNsYpMEmojlhe0EzeDSw1";
let orderData;

function init() {
    getOrderList();
}
init();

// 取得訂單列表
function getOrderList() {
  axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
    {
      headers: {
        'Authorization': token
      }
    })
    .then(response => {
        orderData = response.data.orders;
        console.log(orderData);
        renderOrder();
        renderChart();
    })
    .catch(response => {
      alert("目前沒有訂單唷！");
    })
}

// 渲染訂單
const orderList = document.querySelector("#orderList");
function renderOrder() {
    let str = "";
    orderData.forEach(item => {
        let productsTitle = "";
        item.products.forEach(item => {
            productsTitle += `${item.title}`;
        })
        let orderStatus = "";
        if(item.paid === true){
          orderStatus = "已處理";
        }else if (item.paid === false){
          orderStatus = "未處理";
        }
        str += `<tr>
        <td>${item.id}</td>
        <td>
          <p>${item.user.name}</p>
          <p>${item.user.tel}</p>
        </td>
        <td>${item.user.address}</td>
        <td>${item.user.email}</td>
        <td>
          <p>${productsTitle}</p>
        </td>
        <td>2021/03/08</td>
        <td class="orderStatus">
          <a href="#" class="paid" data-status=${orderStatus} data-id=${item.id}>${orderStatus}</a>
        </td>
        <td>
          <input type="button" class="delSingleOrder-Btn" value="刪除" data-id=${item.id}>
        </td>
    </tr>`
    });
    orderList.innerHTML = str;
}

// 訂單狀態與操作
orderList.addEventListener("click", e => {
  e.preventDefault();
  const targetClass = e.target.getAttribute("class");
  const orderId = e.target.getAttribute("data-id");
  if (targetClass === "paid") {
    let status = e.target.getAttribute("data-status");
    editOrderList(orderId,status);
  } else if (targetClass === "delSingleOrder-Btn") {
    deleteOrderItem(orderId);
  }
})

// 修改訂單狀態
function editOrderList(orderId,status) {
  let newStatus;
  if (status === "已處理") {
    newStatus = false;
  } else if (status === "未處理") {
    newStatus = true;
  }
  axios.put(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
    {
      "data": {
        "id": orderId,
        "paid": newStatus
      }
    },
    {
      headers: {
        'Authorization': token
      }
    })
    .then(response => {
      init();
      alert("修改訂單狀態成功");
    })
    .catch(error => {
      alert("修改訂單狀態失敗");
    })
}

// 刪除特定訂單
function deleteOrderItem(orderId) {
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders/${orderId}`,
    {
      headers: {
        'Authorization': token
      }
    })
    .then(response => {
      init();
      alert("成功刪除此筆訂單");
    })
    .catch(response => {
      alert("刪除此筆訂單失敗");
    })
}

// 刪除全部訂單
const discardAllBtn = document.querySelector(".discardAllBtn");
discardAllBtn.addEventListener("click", e => {
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
    {
      headers: {
        'Authorization': token
      }
    })
    .then(response => {
      init();
      alert("成功清除所有訂單");
    })
    .catch(response => {
      alert("沒有訂單可以刪除！");
    })
})

// C3.js
function renderChart() {
  let chartData = {};
  orderData.forEach(item => {
    item.products.forEach(item => {
      chartData[item.category] === undefined ? chartData[item.category] = 1 : chartData[item.category]++;
    })
  })
  let chartArr = [];
  Object.keys(chartData).forEach((item,index) => {
    chartArr.push([item,Object.values(chartData)[index]])
  })
  let chart = c3.generate({
    bindto: '#chart', 
    data: {
        type: "pie",
        columns: chartArr,
        colors:{
            "床架":"#DACBFF",
            "窗簾":"#9D7FEA",
            "收納": "#5434A7",
        }
    },
  });
}