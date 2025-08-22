let cart=JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(name, price){
  const existingItem=cart.find(item => item.name === name);
  if (existingItem){
    existingItem.quantity=(existingItem.quantity || 1) + 1;
  } else{
    cart.push({ name, price, quantity: 1 });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  alert(`${name} added to cart!`);
  updateCartCount();
}

function displayCart() {
  const cartItemsDiv = document.getElementById("cart-items");
  const cartTotalDiv = document.getElementById("cart-total");
  if (!cartItemsDiv || !cartTotalDiv) return;

  cartItemsDiv.innerHTML = "";
  let total = 0;

  if (cart.length === 0){
    cartItemsDiv.innerHTML="<p>Your cart is empty.</p>";
    cartTotalDiv.textContent="";
    return;
  }

  cart.forEach((item, index) =>{
    const div = document.createElement("div");
    div.innerHTML = `
      <span>${item.name} - ₹${item.price} × ${item.quantity || 1}</span>
      <button onclick="removeFromCart(${index})">Remove</button>
    `;
    cartItemsDiv.appendChild(div);
    total += item.price * (item.quantity || 1);
  });

  cartTotalDiv.textContent = `Total: ₹${total}`;
}

function removeFromCart(index){
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  displayCart();
  updateCartCount();
}

function clearCart(){
  if (confirm("Empty your cart?")){
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
    updateCartCount();
  }
}

function proceedToPayment(){
  if (cart.length === 0){
    alert("Your cart is empty!");
    return;
  }
  window.location.href = 'payment.html';
}

function loadPayment(){
  const paymentItemsDiv = document.getElementById("payment-items");
  const paymentTotalDiv = document.getElementById("payment-total");
  
  if (!paymentItemsDiv || !paymentTotalDiv) return;

  paymentItemsDiv.innerHTML = "";
  let total = 0;

  if (cart.length === 0){
    paymentItemsDiv.innerHTML = "<p>Your cart is empty.</p>";
    paymentTotalDiv.textContent = "";
    return;
  }

  cart.forEach((item) =>{
    const div = document.createElement("div");
    div.className = "payment-item";
    div.innerHTML = `
      <span>${item.name} - ₹${item.price} × ${item.quantity || 1}</span>
    `;
    paymentItemsDiv.appendChild(div);
    total += item.price * (item.quantity || 1);
  });

  paymentTotalDiv.textContent = `Total: ₹${total}`;
}

function selectPayment(method){
  document.querySelectorAll('.payment-option').forEach(option =>{
    option.classList.remove('active');
  });
  
  document.querySelectorAll('.payment-details').forEach(details =>{
    details.style.display = 'none';
  });
  document.getElementById(`${method}-option`).classList.add('active');
  document.getElementById(`${method}-payment`).style.display = 'block';
}

function placeOrder(){
  const addressForm = document.getElementById('address-form');
  if (!addressForm.checkValidity()){
    alert('Please fill all delivery address fields correctly.');
    return;
  }
  const activePayment = document.querySelector('.payment-option.active');
  if (!activePayment){
    alert('Please select a payment method.');
    return;
  }
  
  const paymentMethod = activePayment.id.replace('-option', '');
  
  if (paymentMethod === 'card'){
    const cardForm = document.getElementById('card-form');
    if (!cardForm.checkValidity()){
      alert('Please fill all card details correctly.');
      return;
    }
  } else if (paymentMethod === 'upi'){
    const upiId = document.getElementById('upi-id').value;
    if (!upiId || !upiId.includes('@')){
      alert('Please enter a valid UPI ID.');
      return;
    }
  } else if (paymentMethod === 'netbanking'){
    const bankSelect = document.getElementById('bank-select');
    if (!bankSelect.value){
      alert('Please select a bank.');
      return;
    }
  }
  const order ={
    id: Date.now(),
    items: [...cart],
    total: cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0),
    date: new Date().toLocaleString(),
    address: {
      name: document.getElementById('full-name').value,
      phone: document.getElementById('phone').value,
      address: document.getElementById('address').value,
      city: document.getElementById('city').value,
      pincode: document.getElementById('pincode').value
    },
    paymentMethod: paymentMethod
  };
  let orders = JSON.parse(localStorage.getItem('orders')) || [];
  orders.push(order);
  localStorage.setItem('orders', JSON.stringify(orders));
  
  cart = [];
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  
  alert(`Order placed successfully! Your order ID is ${order.id}. Total: ₹${order.total}`);
  
  window.location.href = 'index.html';
}

let currentUser = JSON.parse(localStorage.getItem('currentUser'));
let users = JSON.parse(localStorage.getItem('users')) || [];

function updateAuthUI(){
  const authLinks = document.querySelectorAll('#auth-link');
  authLinks.forEach(link =>{
    if (currentUser){
      link.textContent = 'Logout';
      link.href = 'javascript:logout()';
    } else{
      link.textContent = 'Login';
      link.href = 'login.html';
    }
  });

  if (document.getElementById('user-details') && currentUser){
    document.getElementById('user-details').innerHTML = `
      <div><strong>Name:</strong> ${currentUser.name}</div>
      <div><strong>Email:</strong> ${currentUser.email}</div>
      <div><strong>Phone:</strong> ${currentUser.phone}</div>
    `;
  }
}

if (document.getElementById('auth-form')){
  document.getElementById('auth-form').addEventListener('submit', function(e){
    e.preventDefault();
    const user ={
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      password: document.getElementById('password').value
    };

    const existingUser = users.find(u => u.email === user.email);
    if (existingUser){
      if (existingUser.password === user.password){
        login(existingUser);
      } else{
        alert("Incorrect password!");
      }
    } else{
      users.push(user);
      localStorage.setItem('users', JSON.stringify(users));
      login(user);
    }
  });
}

function login(user){
  currentUser = user;
  localStorage.setItem('currentUser', JSON.stringify(user));
  updateAuthUI();
  window.location.href = 'profile.html';
}

function logout(){
  currentUser = null;
  localStorage.removeItem('currentUser');
  updateAuthUI();
  window.location.href = 'index.html';
}

function searchItems(){
  const searchTerm = document.getElementById('menu-search').value.toLowerCase();
  const items = document.querySelectorAll('.item');
  
  items.forEach(item =>{
    const itemName = item.querySelector('h3').textContent.toLowerCase();
    item.style.display = itemName.includes(searchTerm) ? 'block' : 'none';
  });
}

updateAuthUI();
updateCartCount();

function updateCartCount(){
  const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const cartLinks = document.querySelectorAll('#cart-link');
  cartLinks.forEach(link => {
    link.textContent = count > 0 ? `Cart (${count})` : 'Cart';
  });
}