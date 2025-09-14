let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(name, price) {
  const existingItem = cart.find(item => item.name === name);
  if (existingItem) {
    existingItem.quantity = (existingItem.quantity || 1) + 1;
  } else {
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

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = "<p>Your cart is empty.</p>";
    cartTotalDiv.textContent = "";
    return;
  }

  cart.forEach((item, index) => {
    const itemTotal = item.price * (item.quantity || 1);
    total += itemTotal;
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <div class="cart-item-controls">
        <button onclick="updateQuantity(${index}, ${(item.quantity || 1) - 1})">-</button>
        <span class="item-quantity">${item.quantity || 1}</span>
        <button onclick="updateQuantity(${index}, ${(item.quantity || 1) + 1})">+</button>
      </div>
      <span class="item-name">${item.name}</span>
      <span class="item-price">₹${itemTotal}</span>
      <button onclick="removeFromCart(${index})" class="danger">Remove</button>
    `;
    cartItemsDiv.appendChild(div);
  });
  cartTotalDiv.textContent = `Total: ₹${total}`;
}

function updateQuantity(index, newQuantity) {
  if (newQuantity < 1) { removeFromCart(index); return; }
  cart[index].quantity = newQuantity;
  localStorage.setItem('cart', JSON.stringify(cart));
  displayCart();
  updateCartCount();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  displayCart();
  updateCartCount();
}

function clearCart() {
  if (confirm("Empty your cart?")) {
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
    updateCartCount();
  }
}

function proceedToPayment() {
  if (cart.length === 0) { alert("Your cart is empty!"); return; }
  localStorage.setItem('cart', JSON.stringify(cart));
  window.location.href = "payment.html";
}

function loadPayment() {
  cart = JSON.parse(localStorage.getItem('cart')) || [];

  const paymentItemsDiv = document.getElementById("payment-items");
  const paymentTotalDiv = document.getElementById("payment-total");
  if (!paymentItemsDiv || !paymentTotalDiv) return;

  paymentItemsDiv.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    paymentItemsDiv.innerHTML = "<p>Your cart is empty.</p>";
    paymentTotalDiv.textContent = "";
    return;
  }

  cart.forEach(item => {
    const div = document.createElement("div");
    div.className = "payment-item";
    div.innerHTML = `<span>${item.name} - ₹${item.price} × ${item.quantity || 1}</span>`;
    paymentItemsDiv.appendChild(div);
    total += item.price * (item.quantity || 1);
  });

  paymentTotalDiv.textContent = `Total: ₹${total}`;
}

function selectPayment(method) {
  document.querySelectorAll('.payment-option').forEach(option => option.classList.remove('active'));
  document.querySelectorAll('.payment-details').forEach(details => details.style.display = 'none');

  const allPaymentInputs=document.querySelectorAll('#card-payment input, #upi-payment input, #netbanking-payment select');
  allPaymentInputs.forEach(i => i.required = false);

  const optionEl=document.getElementById(`${method}-option`);
  const detailsEl=document.getElementById(`${method}-payment`);
  if (optionEl) optionEl.classList.add('active');
  if (detailsEl) detailsEl.style.display = 'block';

  if (method === 'card'){
    document.getElementById('card-number').required=true;
    document.getElementById('card-name').required=true;
    document.getElementById('expiry').required=true;
    document.getElementById('cvv').required=true;
  } else if (method === 'upi') {
    document.getElementById('upi-id').required=true;
  } else if (method === 'netbanking') {
    document.getElementById('bank-select').required=true;
  }
}

async function placeOrder() {
  const addressForm = document.getElementById('address-form');
  if (!addressForm) { alert('Address form not found.'); return; }
  if (!addressForm.checkValidity()) { alert('Please fill all delivery address fields correctly.'); return; }

  const activePayment = document.querySelector('.payment-option.active');
  if (!activePayment) { alert('Please select a payment method.'); return; }
  const paymentMethod = activePayment.id.replace('-option', '');

  if (paymentMethod === 'card') {
    const cardForm = document.getElementById('card-form');
    if (cardForm && !cardForm.checkValidity()) { alert('Please fill all card details correctly.'); return; }
  } else if (paymentMethod === 'upi') {
    const upiId = document.getElementById('upi-id').value;
    if (!upiId || !upiId.includes('@')) { alert('Please enter a valid UPI ID.'); return; }
  } else if (paymentMethod === 'netbanking') {
    const bank = document.getElementById('bank-select').value;
    if (!bank) { alert('Please select a bank.'); return; }
  }

  const items = JSON.parse(localStorage.getItem('cart')) || [];
  if (!items || items.length === 0) { alert('Your cart is empty.'); return; }

  const orderPayload = {
    items: items,
    address: {
      name: document.getElementById('full-name').value,
      phone: document.getElementById('phone').value,
      address: document.getElementById('address').value,
      city: document.getElementById('city').value,
      pincode: document.getElementById('pincode').value
    },
    paymentMethod: paymentMethod
  };

  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    });
    if (!res.ok) {
      console.error('Server returned', res.status);
      alert('Server error. Please try again later.');
      return;
    }
    const data = await res.json();
    if (data && data.success) {
      cart = [];
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartCount();
      alert(`Order placed successfully! Your order ID is ${data.id}. Total: ₹${data.total}`);
      window.location.href = 'orders.html';
    } else {
      console.error('Unexpected response:', data);
      alert('Something went wrong. Please try again.');
    }
  } catch (err) {
    console.error(err);
    alert('Server error. Please try again later.');
  }
}

function loadOrders() {
  const ordersListDiv = document.getElementById('orders-list');
  if (!ordersListDiv) return;

  fetch('/api/orders')
    .then(res => res.json())
    .then(allOrders => {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (!currentUser) {
        ordersListDiv.innerHTML = '<p class="center">Please login to see your orders.</p>';
        return;
      }

      const userOrders = allOrders.filter(order => order.address && order.address.name === currentUser.name);
      if (userOrders.length === 0) {
        ordersListDiv.innerHTML = '<p class="center">You have no past orders.</p>';
        return;
      }

      userOrders.sort((a, b) => new Date(b.date) - new Date(a.date));

      ordersListDiv.innerHTML = userOrders.map(order => `
        <div class="order-card">
          <h3>Order #${order.id} - ${order.date}</h3>
          <p><strong>Status:</strong> ${order.status}</p>
          <p><strong>Items:</strong> ${order.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}</p>
          <p><strong>Total:</strong> ₹${order.total}</p>
          <p><strong>Address:</strong> ${order.address.address}, ${order.address.city} - ${order.address.pincode}</p>
          <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
        </div>
      `).join('');
    })
    .catch(err => {
      console.error(err);
      ordersListDiv.innerHTML = "<p>Failed to load order history.</p>";
    });
}

async function clearOrderHistory() {
    if (!confirm("Are you sure you want to delete all your order history?")) return;

    try {
        const res = await fetch('/api/orders', { method: 'DELETE' });
        const data = await res.json();

        if (data.success) {
            alert("Order history cleared!");
            document.getElementById('orders-list').innerHTML = "<p class='center'>You have no past orders.</p>";
        } else {
            alert("Failed to clear order history.");
        }
    } catch (err) {
        console.error(err);
        alert("Server error. Please try again later.");
    }
}

let currentUser = JSON.parse(localStorage.getItem('currentUser'));
let users = JSON.parse(localStorage.getItem('users')) || [];

function updateAuthUI() {
  document.querySelectorAll('#auth-link').forEach(link => {
    if (currentUser) {
      link.textContent = 'Logout';
      link.href = 'javascript:logout()';
    } else {
      link.textContent = 'Login';
      link.href = 'login.html';
    }
  });

  if (document.getElementById('user-details') && currentUser) {
    document.getElementById('user-details').innerHTML = `
      <div><strong>Name:</strong> ${currentUser.name}</div>
      <div><strong>Email:</strong> ${currentUser.email}</div>
      <div><strong>Phone:</strong> ${currentUser.phone}</div>
      <div class="center" style="margin-top: 20px;">
        <a href="orders.html"><button>View Your Order History</button></a>
      </div>
    `;
  }
}

if (document.getElementById('auth-form')) {
  document.getElementById('auth-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const user = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      password: document.getElementById('password').value
    };

    const existingUser = users.find(u => u.email === user.email);
    if (existingUser) {
      if (existingUser.password === user.password) login(existingUser);
      else alert('Incorrect password!');
    } else {
      users.push(user);
      localStorage.setItem('users', JSON.stringify(users));
      login(user);
    }
  });
}

function login(user) {
  currentUser = user;
  localStorage.setItem('currentUser', JSON.stringify(user));
  updateAuthUI();
  window.location.href = 'profile.html';
}

function logout() {
  currentUser = null;
  localStorage.removeItem('currentUser');
  updateAuthUI();
  window.location.href = 'index.html';
}

function searchItems() {
  const searchTerm = document.getElementById('menu-search').value.toLowerCase();
  document.querySelectorAll('.item').forEach(item => {
    const itemName = item.querySelector('h3').textContent.toLowerCase();
    item.style.display = itemName.includes(searchTerm) ? 'block' : 'none';
  });
}

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  document.querySelectorAll('#cart-link').forEach(link => {
    link.textContent = count > 0 ? `Cart (${count})` : 'Cart';
  });
}

window.onload = function() {
  updateAuthUI();
  updateCartCount();
  if (document.getElementById('cart-items')) displayCart();
  if (document.getElementById('orders-list')) loadOrders();
  if (document.getElementById('payment-items')) loadPayment();
};
