// 請代入自己的網址路徑
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
    .then(function (response) {
        orderData = response.data.orders;
        console.log(orderData[0].products);
        renderOrder();
    })
}

// 渲染訂單
const orderList = document.querySelector("#orderList");
function renderOrder() {
    let str = "";
    orderData.forEach(item => {
        let productsTitle = "";
        item.products.forEach(item => {
            productsTitle += `${item.title}<br>`;
        })
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
          <a href="#">未處理</a>
        </td>
        <td>
          <input type="button" class="delSingleOrder-Btn" value="刪除" data-id="${item.id}">
        </td>
    </tr>`
    });
    orderList.innerHTML = str;
}

// 修改訂單狀態

function editOrderList(orderId) {
  axios.put(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
    {
      "data": {
        "id": orderId,
        "paid": true
      }
    },
    {
      headers: {
        'Authorization': token
      }
    })
    .then(function (response) {
      console.log(response.data);
    })
}

// 刪除全部訂單
function deleteAllOrder() {
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
    {
      headers: {
        'Authorization': token
      }
    })
    .then(function (response) {
      console.log(response.data);
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
    .then(function (response) {
      console.log(response.data);
    })
}

// C3.js
let chart = c3.generate({
    bindto: '#chart', // HTML 元素綁定
    data: {
        type: "pie",
        columns: [
        ['Louvre 雙人床架', 1],
        ['Antony 雙人床架', 2],
        ['Anty 雙人床架', 3],
        ['其他', 4],
        ],
        colors:{
            "Louvre 雙人床架":"#DACBFF",
            "Antony 雙人床架":"#9D7FEA",
            "Anty 雙人床架": "#5434A7",
            "其他": "#301E5F",
        }
    },
});