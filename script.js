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

function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  alert(`Order placed! Total: ₹${cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0)}`);
  clearCart();
}

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const cartLinks = document.querySelectorAll('#cart-link');
  cartLinks.forEach(link => {
    link.textContent = count > 0 ? `Cart (${count})` : 'Cart';
  });
}

let currentUser = JSON.parse(localStorage.getItem('currentUser'));
let users = JSON.parse(localStorage.getItem('users')) || [];

function updateAuthUI() {
  const authLinks = document.querySelectorAll('#auth-link');
  authLinks.forEach(link => {
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
      if (existingUser.password === user.password) {
        login(existingUser);
      } else {
        alert("Incorrect password!");
      }
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
  const items = document.querySelectorAll('.item');
  
  items.forEach(item => {
    const itemName = item.querySelector('h3').textContent.toLowerCase();
    item.style.display = itemName.includes(searchTerm) ? 'block' : 'none';
  });
}

updateAuthUI();
updateCartCount();