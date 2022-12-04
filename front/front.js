const api_path = "jacky010080";
const token = "DMnVPoozNsYpMEmojlhe0EzeDSw1";
let data;

function init() {
  getProductList();
}
init();
// 取得產品列表
function getProductList() {
  axios
    .get(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products`
    )
    .then((response) => {
      data = response.data.products;
      renderProducts(data);
    })
    .catch(function(error){
      console.log(error.response.data);
    })
}
// 渲染商品資料
const productWrap = document.querySelector(".productWrap");
function renderProducts(data) {
  let str = "";
  data.forEach((item) => {
    str += `<li class="productCard">
                <h4 class="productType">新品</h4>
                <img src=${item.images} alt="">
                <a href="#" class="addCardBtn" data-id="${item.id}">加入購物車</a>
                <h3>${item.title}</h3>
                <del class="originPrice">${item.origin_price}</del>
                <p class="nowPrice">NT$${item.price}</p>
            </li>`;
  });
  productWrap.innerHTML = str;
}

// 選擇商品類型
const productSelect = document.querySelector(".productSelect");
productSelect.addEventListener("change", (e) => {
  let str = "";
  let filtedData;
  if (e.target.value === "全部") {
    filtedData = data;
    renderProducts(filtedData);
  } else {
    filtedData = data.filter((item) => {
      return item.category === e.target.value;
    });
    renderProducts(filtedData);
  }
});

// 渲染購物車
const shoppingCartProducts = document.querySelector(".shoppingCartProducts");
const cartsTotal = document.querySelector(".cartsTotal");
let cartsList;
axios
  .get(
    `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`
  )
  .then((response) => {
    cartsList = response.data.carts;
    renderCarts();
  });
function renderCarts() {
  let str = "";
  let totalPrice = 0;
  cartsList.forEach((item) => {
    totalPrice += item.product.price * item.quantity;
    str += `<tr>
    <td>
                <div class="cardItem-title">
                  <img src=${item.product.images} alt="">
                  <p>${item.product.title}</p>
                </div>
              </td>
              <td>NT$${item.product.price}</td>
              <td>${item.quantity}</td>
              <td>NT$${item.product.price * item.quantity}</td>
              <td class="discardBtn">
              <a href="#" class="material-icons" data-id=${item.id}>clear</a>
              </td>
              </tr>`;
  });
  shoppingCartProducts.innerHTML = str;
  cartsTotal.textContent = totalPrice;
}

// 購物車新增
const addCardBtn = document.querySelector(".addCardBtn");
productWrap.addEventListener("click", (e) => {
  e.preventDefault();
  let addCartClass = e.target.getAttribute("class");
  if (addCartClass !== "addCardBtn") {
    return;
  } else {
    let productId = e.target.getAttribute("data-id");
    let numCheck = 1;
    cartsList.forEach(item => {
      if (item.product.id === productId) {
        numCheck = item.quantity += 1;
      }
    })
    axios
      .post(
        `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`,
        {
          data: {
            productId: productId,
            quantity: numCheck,
          }
        }
      )
      .then((response) => {
        renderCarts();
        alert("成功加入購物車");
      })
      .catch((error) => {
        alert("加入購物車失敗");
      });
  }
});

// 清空購物車
const discardAllBtn = document.querySelector(".discardAllBtn");
discardAllBtn.addEventListener("click", (e) => {
  e.preventDefault();
  axios
    .delete(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`
    )
    .then((response) => {
      renderCarts();
      alert("成功清空購物車！");
    });
});

// 刪除單筆商品
shoppingCartProducts.addEventListener("click", (e) => {
  e.preventDefault();
  const cartId = e.target.getAttribute("data-Id");
  if (cartId === null) {
    return;
  }else {
    axios
      .delete(
        `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts/${cartId}`
      )
      .then((response) => {
        renderCarts();
        alert("成功刪除商品");
      });
  }
});

// 送出購買訂單
const customerName = document.querySelector("#customerName");
const customerPhone = document.querySelector("#customerPhone");
const customerEmail = document.querySelector("#customerEmail");
const customerAddress = document.querySelector("#customerAddress");
const tradeWay = document.querySelector("#tradeWay");
const submitOrder = document.querySelector("#submitOrder");
submitOrder.addEventListener("click", e => {
  e.preventDefault();
  let obj = {
    "data": {
      "user": {
      }
    }
  };
  obj.data.user.name = customerName.value;
  obj.data.user.tel = customerPhone.value;
  obj.data.user.email = customerEmail.value;
  obj.data.user.address = customerAddress.value;
  obj.data.user.payment = tradeWay.value;
  console.log(obj);
  axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/orders`,
    obj)
    .then(function (response) {
      alert("成功送出訂單");
      console.log(response.data);
    })
    .catch(function(error){
      alert("訂單出錯啦！");
      console.log(error.response.data);
    })
});
