// cart.js

// Get cart from localStorage
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

// Save cart
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Add product to cart
function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(item => item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart(cart);
  updateCartCount();
  alert(`${product.name} added to cart!`);
}

// Remove product from cart
function removeFromCart(productId) {
  let cart = getCart().filter(item => item.id !== productId);
  saveCart(cart);
  displayCart("cartContainer");
  updateCartCount();
}

// Update quantity of a product
function updateQuantity(productId, quantity) {
  let cart = getCart();
  const item = cart.find(i => i.id === productId);

  if (item) {
    item.quantity = Number(quantity);
    if (item.quantity <= 0) {
      removeFromCart(productId);
    } else {
      saveCart(cart);
    }
  }
  displayCart("cartContainer");
  updateCartCount();
}

// Calculate total price
function getCartTotal() {
  return getCart().reduce((total, item) => {
    let price = item.price;

    if (typeof price === "string") {
      price = Number(price.replace(/[^\d.]/g, ""));
    }

    return total + price * item.quantity;
  }, 0);
}

// Display cart items
function displayCart(containerId) {
  const container = document.getElementById(containerId);
  const cart = getCart();

  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    const totalEl = document.getElementById("totalPrice");
    if (totalEl) totalEl.innerText = "Total: ₹0";
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-details">
        <h3>${item.name}</h3>
        <p>₹${item.price}</p>
        <input type="number" min="1" value="${item.quantity}" onchange="updateQuantity(${item.id}, this.value)">
      </div>
      <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
    </div>
  `).join("");

  const totalEl = document.getElementById("totalPrice");
  if (totalEl) totalEl.innerText = `Total: ₹${getCartTotal()}`;
}

// Update cart count in header
function updateCartCount() {
  const count = getCart().reduce((sum, item) => sum + item.quantity, 0);
  const cartCountEl = document.getElementById("cart-count");
  if (cartCountEl) cartCountEl.innerText = count;
}

// Run on page load
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  displayCart("cartContainer");
});