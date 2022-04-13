const loginSection = document.querySelector("#login-section");
const orderSection = document.querySelector("#order-section");
const loginForm = document.querySelector("#login-form");
const userDetails = orderSection.querySelector("#user-details");
const logoutBtn = orderSection.querySelector("#logout-btn");
const foodMenu = orderSection.querySelector(".food-menu");
const mobile = localStorage.getItem("mobile");
const cartBtn = document.querySelector("#cart-btn");
const cartModal = document.querySelector("#cart-modal");
const cartCloseBtn = cartModal.querySelector(".close");

if (mobile) {
  login();
}

logoutBtn.addEventListener("click", logout);

let foodItems = [];
let cart = [];

function updateCart() {
  let total = 0;
  cart.forEach((e) => {
    total += e.count;
  });

  cartBtn.textContent = "Cart: " + total + " items";
}

function addToCart(id) {
  const current = cart.find((i) => i.id === id);
  if (current) current.count++;
  else
    cart.push({
      id: id,
      count: 1,
    });
  updateCart();
}

function removeFromCart(id) {
  const current = cart.find((i) => i.id === id);
  if (current) {
    current.count--;
    if (current.count === 0) {
      const index = cart.indexOf(current);
      cart.splice(index, 1);
    }
  }
  updateCart();
}

function logout() {
  loginSection.style.display = "flex";
  orderSection.style.display = "none";
  localStorage.clear();
}

function login() {
  loginSection.style.display = "none";
  orderSection.style.display = "block";
  userDetails.innerHTML = "<h3>" + localStorage.getItem("name") + "</h3>";
  userDetails.innerHTML +=
    "<span class='table-number'>Table No: <b>" +
    localStorage.getItem("table") +
    "</b></span>";
  loadFoodItems();
}

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log("submitted");
  const button = loginForm.querySelector("button");

  const name = loginForm.name.value;
  const mobile = loginForm.mobile.value;
  const table = loginForm.table.value;

  if (name === "") {
    alert("Please provide your name!");
    return;
  } else if (mobile === "" || mobile.length < 10) {
    alert("Please provide your correct mobile number!");
    return;
  } else if (table === "") {
    alert("Please provide your table number!");
    return;
  }

  button.disabled = true;
  button.innerHTML = "...";

  const data = {
    name: name,
    mobile: mobile,
    table: table,
  };

  // ! callback registered with browser
  /*fetch("http://localhost:8080/login", {
        method: 'post',
        body: JSON.stringify(data)
    }).then((res) => {
        return res.text()
    }).then((str) => {
        console.log(str)
    });*/

  const result = await fetch("http://localhost:8080/login", {
    method: "post",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const res = await result.json();

  if (res.status === 1) {
    localStorage.setItem("name", name);
    localStorage.setItem("mobile", mobile);
    localStorage.setItem("table", table);
    login();
  } else {
    alert(res.message);
  }

  button.disabled = false;
  button.innerHTML = "Order Now";
});

function addFoodItem(item) {
  const card = document.createElement("div");
  card.className = "card";
  card.id = "food-item-" + item.id;

  const image = document.createElement("img");
  image.src = item.picture;
  image.alt = item.u_name;

  const cardHeader = document.createElement("div");
  cardHeader.className = "card-header";
  const titleContainer = document.createElement("div");
  const foodName = document.createElement("h3");
  foodName.textContent = item.u_name;
  const foodPrice = document.createElement("span");
  foodPrice.className = "price";
  foodPrice.textContent = item.price;
  titleContainer.appendChild(foodName);
  titleContainer.appendChild(foodPrice);
  cardHeader.appendChild(titleContainer);
  const buttonContainer = document.createElement("div");
  buttonContainer.className = "button-container";
  cardHeader.appendChild(buttonContainer);
  card.appendChild(image);
  card.appendChild(cardHeader);
  foodMenu.appendChild(card);
  updateButtons(buttonContainer, item.id);
}

function updateButtons(buttonContainer, id) {
  buttonContainer.innerHTML = "";
  function addItem() {
    addToCart(id);
    updateButtons(buttonContainer, id);
  }
  function removeItem() {
    removeFromCart(id);
    updateButtons(buttonContainer, id);
  }
  const cartItem = cart.find((i) => i.id === id);
  if (cartItem) {
    const quantityMenu = document.createElement("div");
    quantityMenu.className = "quantity-menu";
    const addButton = document.createElement("button");
    const removeButton = document.createElement("button");
    addButton.innerHTML = '<img alt="minus" src="icons/plus.svg">';
    removeButton.innerHTML = '<img alt="minus" src="icons/minus.svg">';
    const span = document.createElement("span");
    span.textContent = cartItem.count;
    quantityMenu.appendChild(removeButton);
    quantityMenu.appendChild(span);
    quantityMenu.appendChild(addButton);
    buttonContainer.appendChild(quantityMenu);
    addButton.addEventListener("click", addItem);
    removeButton.addEventListener("click", removeItem);
  } else {
    const addButton = document.createElement("button");
    addButton.textContent = "Add";
    buttonContainer.appendChild(addButton);
    addButton.addEventListener("click", addItem);
  }
}

function renderItems() {
    foodMenu.innerHTML = "";
    for (let i = 0; i < foodItems.length; i++) {
        addFoodItem(foodItems[i]);
    }
}

function loadFoodItems() {
  foodMenu.innerHTML = '<div class="loader"></div>';
  fetch("http://localhost:8080/food-items")
    .then(function (res) {
      return res.json();
    })
    .then(function (raw_data) {
      foodItems = raw_data.items;
      renderItems();
    });
}



/*
<div class="cart-item">
    <span class="title">Palak Paneer</span>
    <span class="price">200.00</span>
    <div class="quantity-menu">
        <button>
            <img alt="minus" src="icons/minus.svg">
        </button>
        <span>10</span>
        <button>
            <img alt="minus" src="icons/plus.svg">
        </button>
    </div>
</div>
*/





function getTotal() {
  let total = 0;
  cart.forEach(function (item) {
    const foodItem = foodItems.find((i) => item.id === i.id);
    total += foodItem.price * item.count;
  });
  return total;
}

function placeOrder(data) {
    const promise = new Promise((resolve, reject) => {
        const totalCount = cart.reduce((sum, curr) => sum + curr.count, 0)
        if(totalCount < 2) {
            setTimeout(() => {
                reject({
                    status: 0,
                    message: 'Minimum 2 item can be ordered!'
                })
            }, 1000)
        } else {
            setTimeout(() => {
                resolve({
                    status: 1,
                    message: 'Order Placed!'
                })
            }, 2000)
        }
    })
    return promise;
}

function confirmOrder() {
    if(cart.length === 0) return;
    const mobile = localStorage.getItem('mobile')
    const orderDetails = {
        mobile: mobile,
        items: cart
    }
    const orderBtn = cartModal.querySelector('.cart-footer button')
    placeOrder(orderDetails)
    .then(res => {
        cart = []
        updateCart()
        const cartItemsDiv = cartModal.querySelector(".items");
        const cartFooter = cartModal.querySelector(".cart-footer");
        cartFooter.innerHTML = "";
        cartItemsDiv.innerHTML = '<img src="icons/order-confirmed.svg" class="cart-empty" /> <br/> ' + res.message;
        renderItems()
    })
    .catch(e => {
        orderBtn.innerHTML = 'Order Now'
        alert(e.message)
    })
    orderBtn.innerHTML = '<div class="loader"></div>'

}

function openCart() {
  const cartItemsDiv = cartModal.querySelector(".items");
  const cartFooter = cartModal.querySelector(".cart-footer");
  cartFooter.innerHTML = "";
  cartItemsDiv.innerHTML = "";
  if (cart.length === 0) {
    cartItemsDiv.innerHTML =
      '<img src="icons/empty-cart.svg" class="cart-empty" /> <br/> Nothing in cart!';
  }
  cart.forEach(function (item) {
    const foodItem = foodItems.find((i) => item.id === i.id);
    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";
    const title = document.createElement("span");
    title.className = "title";
    title.textContent = foodItem.u_name;
    const price = document.createElement("span");
    price.className = "price";
    price.textContent = foodItem.price;
    const quantityMenu = document.createElement("div");
    quantityMenu.className = "quantity-menu";
    const minusButton = document.createElement("button");
    const minusImg = document.createElement("img");
    minusImg.src = "icons/minus.svg";
    minusButton.appendChild(minusImg);
    const quantity = document.createElement("span");
    quantity.textContent = item.count;
    const plusButton = document.createElement("button");
    const plusImg = document.createElement("img");
    plusImg.src = "icons/plus.svg";
    plusButton.appendChild(plusImg);
    quantityMenu.appendChild(minusButton);
    quantityMenu.appendChild(quantity);
    quantityMenu.appendChild(plusButton);
    cartItem.appendChild(title);
    cartItem.appendChild(price);
    cartItem.appendChild(quantityMenu);
    cartItemsDiv.appendChild(cartItem);

    function updateCount() {
      quantity.textContent = item.count;
      const currentFoodItem = foodMenu.querySelector("#food-item-" + item.id);
      const buttonContainer =
        currentFoodItem.querySelector(".button-container");
      updateButtons(buttonContainer, item.id);
      updateTotal();
    }
    function addItem() {
      addToCart(item.id);
      updateCount();
    }
    function removeItem() {
      removeFromCart(item.id);
      updateCount();
      if (item.count === 0) {
        openCart();
      }
    }
    minusButton.addEventListener("click", removeItem);
    plusButton.addEventListener("click", addItem);
  });

  function updateTotal() {
    const total = getTotal();
    cartFooter.innerHTML = ''
    if (total !== 0) {
      const discount = total / 10;
      cartFooter.innerHTML += `
        Total: ${total} <br/>
        Discount %: 10 <br/>
        Discount in RS: ${discount} <br/>
        Net Payable: ${total - discount} <br/>
        <button onclick="confirmOrder()">Order Now</button>
        `;
    }
  }
  updateTotal();
  cartModal.classList.add("show");
}
function closeCart() {
  cartModal.classList.remove("show");
}

cartBtn.addEventListener("click", openCart);
cartCloseBtn.addEventListener("click", closeCart);
