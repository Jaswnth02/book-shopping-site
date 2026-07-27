// Cart & Auth State Management with localStorage
let rawCart = [];
try {
  rawCart = JSON.parse(localStorage.getItem('bookhive_cart'));
} catch (e) {
  rawCart = null;
}

// Initial demo items if cart has never been initialized
if (!rawCart) {
  rawCart = [
    { title: "Harry Potter", price: 499, image: "books img/1.jpg", quantity: 1 },
    { title: "Atomic Habits", price: 599, image: "books img/7.jpg", quantity: 1 }
  ];
  localStorage.setItem('bookhive_cart', JSON.stringify(rawCart));
}

let cart = Array.isArray(rawCart) ? rawCart.filter(item => item && item.title) : [];
let promoApplied = false;
let currentUser = JSON.parse(localStorage.getItem('bookhive_user')) || null;

// Orders Management State
let orders = [];
try {
  orders = JSON.parse(localStorage.getItem('bookhive_orders')) || [];
} catch (e) {
  orders = [];
}

// Initial demo order if user has never placed one yet
if (orders.length === 0) {
  orders = [
    {
      id: "#BH-89210",
      date: "Jul 25, 2026",
      status: "In Transit",
      paymentMethod: "Credit Card (•••• 4242)",
      shippingAddress: {
        name: "Jaswanth M",
        email: "jaswanthmg2006@gmail.com",
        phone: "+91 98765 43210",
        address: "123 Harmony Street, Apt 4B",
        city: "Bengaluru",
        state: "Karnataka",
        pincode: "560001",
        type: "Home"
      },
      items: [
        { title: "Atomic Habits", price: 599, image: "books img/7.jpg", quantity: 1 },
        { title: "Harry Potter", price: 499, image: "books img/1.jpg", quantity: 1 }
      ],
      subtotal: 1098,
      tax: 55,
      discount: 0,
      total: 1153,
      estimatedDelivery: "Jul 29, 2026"
    }
  ];
  localStorage.setItem('bookhive_orders', JSON.stringify(orders));
}

// Active checkout shipping state
let checkoutShippingInfo = null;
let selectedPaymentMethod = 'card';

function saveCart() {
  localStorage.setItem('bookhive_cart', JSON.stringify(cart));
  updateCartUI();
}

function saveUser(user) {
  currentUser = user;
  if (user) {
    localStorage.setItem('bookhive_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('bookhive_user');
  }
  updateUserUI();
  if (window.location.pathname.endsWith('checkout.html')) {
    prefillCheckoutUser();
  }
}

function updateUserUI() {
  const loginActionElements = document.querySelectorAll('.login-action');
  loginActionElements.forEach(el => {
    if (currentUser) {
      el.setAttribute('href', '#');
      el.onclick = null;
      el.innerHTML = `
        <div class="user-dropdown">
          <button class="user-btn" onclick="toggleUserDropdown(event, this)">
            <i class="fas fa-user-circle" style="color: #ff9800; font-size: 18px;"></i>
            <span class="action-label">${currentUser.name || 'Account'}</span>
            <i class="fas fa-chevron-down" style="font-size: 10px;"></i>
          </button>
          <div class="user-menu" id="user-dropdown-menu">
            <a href="cart.html"><i class="fas fa-shopping-bag"></i> My Cart</a>
            <a href="orders.html"><i class="fas fa-box"></i> My Orders</a>
            <a href="#" onclick="alert('Saved to Wishlist!')"><i class="fas fa-heart"></i> Wishlist</a>
            <button onclick="logoutUser()"><i class="fas fa-sign-out-alt" style="color: #ef4444;"></i> Logout</button>
          </div>
        </div>
      `;
    } else {
      el.setAttribute('href', '#');
      el.onclick = openLoginModal;
      el.innerHTML = `
        <i class="far fa-user"></i>
        <span class="action-label">Login</span>
      `;
    }
  });
}

function openLoginModal(e) {
  if (e) e.preventDefault();
  const modal = document.getElementById('login-modal');
  const backdrop = document.getElementById('login-modal-backdrop');
  if (modal && backdrop) {
    modal.classList.add('open');
    backdrop.classList.add('open');
  } else {
    window.location.href = 'login.html';
  }
}

function closeLoginModal() {
  const modal = document.getElementById('login-modal');
  const backdrop = document.getElementById('login-modal-backdrop');
  if (modal && backdrop) {
    modal.classList.remove('open');
    backdrop.classList.remove('open');
  }
}

function switchModalAuthTab(tabName) {
  const loginBtn = document.getElementById('modal-tab-login-btn');
  const signupBtn = document.getElementById('modal-tab-signup-btn');
  const loginForm = document.getElementById('modal-login-form');
  const signupForm = document.getElementById('modal-signup-form');

  if (tabName === 'login') {
    if (loginBtn) loginBtn.classList.add('active');
    if (signupBtn) signupBtn.classList.remove('active');
    if (loginForm) loginForm.classList.add('active');
    if (signupForm) signupForm.classList.remove('active');
  } else {
    if (signupBtn) signupBtn.classList.add('active');
    if (loginBtn) loginBtn.classList.remove('active');
    if (signupForm) signupForm.classList.add('active');
    if (loginForm) loginForm.classList.remove('active');
  }
}

function handleModalLoginSubmit(e) {
  e.preventDefault();
  const email = document.getElementById('modal-login-email').value;
  let name = email.split('@')[0];
  if (email.toLowerCase().includes('jaswanth')) {
    name = 'Jaswanth';
  } else {
    name = name.charAt(0).toUpperCase() + name.slice(1);
  }
  saveUser({ name: name, email: email });
  showToast(`Welcome back, ${name}!`);
  closeLoginModal();
}

function handleModalSignupSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('modal-signup-name').value;
  const email = document.getElementById('modal-signup-email').value;
  saveUser({ name: name || 'Jaswanth', email: email || 'jaswanthmg2006@gmail.com' });
  showToast(`Account created! Welcome, ${name || 'Jaswanth'}!`);
  closeLoginModal();
}

function toggleUserDropdown(e, btn) {
  e.preventDefault();
  e.stopPropagation();
  const menu = btn.parentElement.querySelector('.user-menu');
  if (menu) {
    menu.classList.toggle('open');
  }
}

document.addEventListener('click', (e) => {
  const menus = document.querySelectorAll('.user-menu.open');
  menus.forEach(m => {
    if (!m.contains(e.target) && !e.target.closest('.user-btn')) {
      m.classList.remove('open');
    }
  });
});

function togglePasswordVisibility(inputId, icon) {
  const input = document.getElementById(inputId);
  if (input) {
    if (input.type === 'password') {
      input.type = 'text';
      icon.className = 'far fa-eye-slash toggle-pwd';
    } else {
      input.type = 'password';
      icon.className = 'far fa-eye toggle-pwd';
    }
  }
}

function logoutUser() {
  saveUser(null);
  showToast('Logged out successfully');
}

function updateCartUI() {
  cart = cart.filter(item => item && item.title);
  const totalCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  
  const badges = document.querySelectorAll('#cart-count, .cart-badge');
  badges.forEach(badge => {
    badge.innerText = totalCount;
  });

  const sidebarContainer = document.getElementById('cart-items-body');
  const sidebarFooter = document.getElementById('cart-footer-content');
  
  if (sidebarContainer) {
    if (cart.length === 0) {
      sidebarContainer.innerHTML = `
        <div class="cart-empty-state">
          <i class="fas fa-shopping-basket"></i>
          <h4>Your Cart is Empty</h4>
          <p>Explore our books catalog and add your favorites!</p>
        </div>
      `;
      if (sidebarFooter) sidebarFooter.style.display = 'none';
    } else {
      if (sidebarFooter) sidebarFooter.style.display = 'flex';
      let subtotal = 0;
      let itemsHtml = '';

      cart.forEach((item, index) => {
        const itemPrice = item.price || 499;
        const itemQty = item.quantity || 1;
        const itemTotal = itemPrice * itemQty;
        subtotal += itemTotal;

        itemsHtml += `
          <div class="cart-item">
            <img src="${item.image || 'books img/1.jpg'}" alt="${item.title}" class="cart-item-img">
            <div class="cart-item-details">
              <div class="cart-item-title">${item.title}</div>
              <div class="cart-item-price">₹${itemPrice}</div>
              <div class="cart-item-actions">
                <div class="qty-control">
                  <button class="qty-btn" onclick="updateQuantity(${index}, -1)">-</button>
                  <span class="qty-val">${itemQty}</span>
                  <button class="qty-btn" onclick="updateQuantity(${index}, 1)">+</button>
                </div>
                <button class="remove-item-btn" onclick="removeFromCart(${index})" title="Remove">
                  <i class="far fa-trash-alt"></i>
                </button>
              </div>
            </div>
          </div>
        `;
      });

      sidebarContainer.innerHTML = itemsHtml;
      const subtotalEl = document.getElementById('cart-subtotal');
      const totalEl = document.getElementById('cart-total');
      if (subtotalEl) subtotalEl.innerText = `₹${subtotal}`;
      if (totalEl) totalEl.innerText = `₹${subtotal}`;
    }
  }

  const pageContainer = document.getElementById('cart-table-container');
  const pageWrapper = document.getElementById('cart-page-wrapper');
  const pageSummaryCol = document.querySelector('.cart-summary-column');
  const pageActions = document.querySelector('.cart-page-actions');

  if (pageContainer) {
    if (cart.length === 0) {
      pageContainer.innerHTML = `
        <div class="cart-empty-state" style="padding: 60px 20px;">
          <i class="fas fa-shopping-basket" style="font-size: 64px; color: #d1d5db; margin-bottom: 20px;"></i>
          <h3 style="font-size: 22px; font-weight: 700; color: #111827; margin-bottom: 10px;">Your Shopping Cart is Empty</h3>
          <p style="color: #6b7280; font-size: 15px; margin-bottom: 25px;">You have no items in your cart. Start exploring our collections!</p>
          <a href="books.html" class="continue-shopping-btn" style="background: #ff9800; color: #ffffff; border: none; padding: 12px 28px; border-radius: 25px; text-decoration: none;"><i class="fas fa-book-open"></i> Start Shopping</a>
        </div>
      `;
      if (pageSummaryCol) pageSummaryCol.style.display = 'none';
      if (pageActions) pageActions.style.display = 'none';
      if (pageWrapper) pageWrapper.style.gridTemplateColumns = '1fr';
    } else {
      if (pageSummaryCol) pageSummaryCol.style.display = 'block';
      if (pageActions) pageActions.style.display = 'flex';
      if (pageWrapper) pageWrapper.style.gridTemplateColumns = '1fr 380px';

      let subtotal = 0;
      let pageHtml = `
        <div class="cart-table-header">
          <span>Product</span>
          <span>Price</span>
          <span>Quantity</span>
          <span>Subtotal</span>
          <span></span>
        </div>
      `;

      cart.forEach((item, index) => {
        const itemPrice = item.price || 499;
        const itemQty = item.quantity || 1;
        const itemTotal = itemPrice * itemQty;
        subtotal += itemTotal;

        pageHtml += `
          <div class="cart-page-item">
            <div class="cart-item-product">
              <img src="${item.image || 'books img/1.jpg'}" alt="${item.title}" class="cart-page-img">
              <div class="cart-item-info">
                <h4>${item.title}</h4>
                <span>Book</span>
              </div>
            </div>
            <div class="cart-item-unit-price">₹${itemPrice}</div>
            <div class="qty-control">
              <button class="qty-btn" onclick="updateQuantity(${index}, -1)">-</button>
              <span class="qty-val">${itemQty}</span>
              <button class="qty-btn" onclick="updateQuantity(${index}, 1)">+</button>
            </div>
            <div class="cart-item-subtotal">₹${itemTotal}</div>
            <button class="remove-item-btn" onclick="removeFromCart(${index})" title="Remove item">
              <i class="far fa-trash-alt"></i>
            </button>
          </div>
        `;
      });

      pageContainer.innerHTML = pageHtml;

      const pageSubtotalEl = document.getElementById('page-cart-subtotal');
      const pageTotalEl = document.getElementById('page-cart-total');
      if (pageSubtotalEl) pageSubtotalEl.innerText = `₹${subtotal}`;
      
      if (promoApplied) {
        const discount = Math.round(subtotal * 0.2);
        if (pageTotalEl) pageTotalEl.innerText = `₹${subtotal - discount} (20% OFF)`;
      } else {
        if (pageTotalEl) pageTotalEl.innerText = `₹${subtotal}`;
      }
    }
  }

  // Update checkout page if active
  if (document.getElementById('checkout-items-list')) {
    renderCheckoutPage();
  }
}

function addToCart(btnElement) {
  if (!btnElement || btnElement instanceof Event) {
    btnElement = (window.event && (window.event.target || window.event.srcElement)) ? (window.event.target || window.event.srcElement) : null;
  }

  let title = "Book";
  let price = 499;
  let image = "books img/1.jpg";

  if (btnElement) {
    const card = btnElement.closest('.card, .premium-book-card, .offer-card, .basic-card, .deal-section, .cart-page-item');
    if (card) {
      const titleEl = card.querySelector('.book-title, .premium-book-title, .offer-subject, h2, h3, h4');
      const priceEl = card.querySelector('.price, .premium-price, .offer-highlight, strong, .cart-item-unit-price');
      const imgEl = card.querySelector('img');

      if (titleEl && titleEl.innerText.trim()) {
        title = titleEl.innerText.trim();
      }
      if (priceEl && priceEl.innerText) {
        const rawPrice = priceEl.innerText.replace(/[^0-9]/g, '');
        if (rawPrice) price = parseInt(rawPrice, 10);
      }
      if (imgEl && imgEl.getAttribute('src')) {
        image = imgEl.getAttribute('src');
      }
    }
  }

  if (!title || title === "Book") {
    title = "Harry Potter";
  }

  const existingIndex = cart.findIndex(item => item && item.title === title);
  if (existingIndex > -1) {
    cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + 1;
  } else {
    cart.push({
      title: title,
      price: price || 499,
      image: image || "books img/1.jpg",
      quantity: 1
    });
  }

  saveCart();
  showToast(`Added "${title}" to cart! <a href="cart.html" style="color:#ff9800; font-weight:700; text-decoration:underline; margin-left:8px;">Go to Cart →</a>`);
  
  if (!window.location.pathname.endsWith('cart.html') && !window.location.pathname.endsWith('checkout.html')) {
    openCartSidebar();
  }
}

function updateQuantity(index, change) {
  if (cart[index]) {
    cart[index].quantity = (cart[index].quantity || 1) + change;
    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }
    saveCart();
  }
}

function removeFromCart(index) {
  if (cart[index]) {
    const title = cart[index].title;
    cart.splice(index, 1);
    saveCart();
    showToast(`Removed "${title}" from cart`);
  }
}

function clearCart() {
  cart = [];
  promoApplied = false;
  saveCart();
  showToast("Cart cleared");
}

function checkoutCart() {
  if (cart.length === 0) {
    showToast("Your cart is empty! Add books to checkout.");
    return;
  }
  window.location.href = 'checkout.html';
}

function applyPromo() {
  const input = document.getElementById('promo-code-input');
  if (!input) return;
  const code = input.value.trim().toUpperCase();
  if (code === 'BOOK20' || code === 'DISCOUNT20' || code === 'SAVE20') {
    if (!promoApplied) {
      promoApplied = true;
      updateCartUI();
      showToast('20% Discount Promo Code Applied!');
    } else {
      showToast('Promo code already applied');
    }
  } else if (code.length > 0) {
    showToast('Invalid Code. Try "BOOK20"');
  }
}

function showToast(message) {
  let toast = document.getElementById('cart-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'cart-toast';
    toast.className = 'cart-toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<i class="fas fa-check-circle"></i> <span>${message}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

function openCartSidebar() {
  const sidebar = document.getElementById('cart-sidebar');
  const backdrop = document.getElementById('cart-backdrop');
  if (sidebar && backdrop) {
    sidebar.classList.add('open');
    backdrop.classList.add('open');
  }
}

function closeCartSidebar() {
  const sidebar = document.getElementById('cart-sidebar');
  const backdrop = document.getElementById('cart-backdrop');
  if (sidebar && backdrop) {
    sidebar.classList.remove('open');
    backdrop.classList.remove('open');
  }
}

function toggleWishlist(btn) {
  btn.classList.toggle('active');
  const icon = btn.querySelector('i');
  if (btn.classList.contains('active')) {
    icon.className = 'fas fa-heart';
    icon.style.color = '#ef4444';
  } else {
    icon.className = 'far fa-heart';
    icon.style.color = '';
  }
}

/* ==========================================================
   ORDER PROCESSING MODULE (CHECKOUT & PAYMENT SIMULATION)
   ========================================================== */

function prefillCheckoutUser() {
  const nameInput = document.getElementById('shipping-name');
  const emailInput = document.getElementById('shipping-email');
  if (currentUser) {
    if (nameInput && !nameInput.value) nameInput.value = currentUser.name || 'Jaswanth M';
    if (emailInput && !emailInput.value) emailInput.value = currentUser.email || 'jaswanthmg2006@gmail.com';
  }
}

function renderCheckoutPage() {
  const checkoutItemsContainer = document.getElementById('checkout-items-list');
  if (!checkoutItemsContainer) return;

  prefillCheckoutUser();

  if (cart.length === 0 && !document.getElementById('confirmed-order-id')?.innerText.includes('#BH-')) {
    checkoutItemsContainer.innerHTML = `
      <div style="text-align: center; padding: 20px; color: #6b7280;">
        <p>No items in cart.</p>
        <a href="books.html" style="color: #ff9800; font-weight: 600; text-decoration: underline;">Return to Shop</a>
      </div>
    `;
    return;
  }

  let subtotal = 0;
  let itemsHtml = '';

  cart.forEach(item => {
    const itemPrice = item.price || 499;
    const itemQty = item.quantity || 1;
    const itemTotal = itemPrice * itemQty;
    subtotal += itemTotal;

    itemsHtml += `
      <div class="checkout-item-row">
        <img src="${item.image || 'books img/1.jpg'}" alt="${item.title}">
        <div class="c-item-info">
          <h4>${item.title}</h4>
          <span>Qty: ${itemQty} × ₹${itemPrice}</span>
        </div>
        <div class="c-item-total">₹${itemTotal}</div>
      </div>
    `;
  });

  checkoutItemsContainer.innerHTML = itemsHtml;

  const tax = Math.round(subtotal * 0.05);
  let discount = 0;
  if (promoApplied) {
    discount = Math.round(subtotal * 0.2);
  }

  const grandTotal = subtotal + tax - discount;

  const subtotalEl = document.getElementById('checkout-subtotal');
  const taxEl = document.getElementById('checkout-tax');
  const discountRow = document.getElementById('checkout-discount-row');
  const discountEl = document.getElementById('checkout-discount');
  const grandTotalEl = document.getElementById('checkout-grand-total');
  const paymentBtnAmount = document.getElementById('payment-btn-amount');

  if (subtotalEl) subtotalEl.innerText = `₹${subtotal}`;
  if (taxEl) taxEl.innerText = `₹${tax}`;

  if (discount > 0) {
    if (discountRow) discountRow.style.display = 'flex';
    if (discountEl) discountEl.innerText = `-₹${discount}`;
  } else {
    if (discountRow) discountRow.style.display = 'none';
  }

  if (grandTotalEl) grandTotalEl.innerText = `₹${grandTotal}`;
  if (paymentBtnAmount) paymentBtnAmount.innerText = `₹${grandTotal}`;
}

function goToStep(stepNum) {
  const steps = [1, 2, 3];
  steps.forEach(num => {
    const panel = document.getElementById(num === 1 ? 'step-panel-shipping' : num === 2 ? 'step-panel-payment' : 'step-panel-confirmation');
    const stepNav = document.getElementById(`step-nav-${num}`);
    if (panel) {
      if (num === stepNum) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    }
    if (stepNav) {
      if (num <= stepNum) {
        stepNav.classList.add('active');
      } else {
        stepNav.classList.remove('active');
      }
    }
  });

  const line1 = document.getElementById('line-1-2');
  const line2 = document.getElementById('line-2-3');
  if (line1) line1.classList.toggle('active', stepNum >= 2);
  if (line2) line2.classList.toggle('active', stepNum >= 3);

  window.scrollTo({ top: 120, behavior: 'smooth' });
}

function handleProceedToPayment(e) {
  e.preventDefault();
  
  const name = document.getElementById('shipping-name').value.trim();
  const email = document.getElementById('shipping-email').value.trim();
  const phone = document.getElementById('shipping-phone').value.trim();
  const address = document.getElementById('shipping-address').value.trim();
  const city = document.getElementById('shipping-city').value.trim();
  const state = document.getElementById('shipping-state').value.trim();
  const pincode = document.getElementById('shipping-pincode').value.trim();
  const type = document.getElementById('address-type').value;

  if (!name || !email || !phone || !address || !city || !state || !pincode) {
    showToast('Please fill in all required shipping fields');
    return;
  }

  checkoutShippingInfo = { name, email, phone, address, city, state, pincode, type };
  goToStep(2);
}

function switchPaymentMethod(method) {
  selectedPaymentMethod = method;
  const methods = ['card', 'upi', 'netbanking', 'cod'];
  const btns = document.querySelectorAll('.payment-tab-btn');
  
  btns.forEach((btn, idx) => {
    if (methods[idx] === method) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  methods.forEach(m => {
    const panel = document.getElementById(`payment-panel-${m}`);
    if (panel) {
      if (m === method) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    }
  });
}

function formatCardNumber(input) {
  let val = input.value.replace(/\D/g, '');
  val = val.substring(0, 16);
  let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
  input.value = formatted;

  const preview = document.getElementById('card-num-preview');
  if (preview) {
    preview.innerText = formatted || '•••• •••• •••• 4242';
  }
}

function formatCardExpiry(input) {
  let val = input.value.replace(/\D/g, '');
  if (val.length >= 3) {
    val = val.substring(0, 2) + '/' + val.substring(2, 4);
  }
  input.value = val;

  const preview = document.getElementById('card-exp-preview');
  if (preview) {
    preview.innerText = val || '12/28';
  }
}

function updateCardName(val) {
  const preview = document.getElementById('card-name-preview');
  if (preview) {
    preview.innerText = (val.trim() || 'JASWANTH M').toUpperCase();
  }
}

function executePaymentSimulation() {
  if (cart.length === 0) {
    showToast('Cart is empty!');
    return;
  }

  if (!checkoutShippingInfo) {
    checkoutShippingInfo = {
      name: document.getElementById('shipping-name')?.value || 'Jaswanth M',
      email: document.getElementById('shipping-email')?.value || 'jaswanthmg2006@gmail.com',
      phone: document.getElementById('shipping-phone')?.value || '+91 98765 43210',
      address: document.getElementById('shipping-address')?.value || '123 Harmony Street, Apt 4B',
      city: document.getElementById('shipping-city')?.value || 'Bengaluru',
      state: document.getElementById('shipping-state')?.value || 'Karnataka',
      pincode: document.getElementById('shipping-pincode')?.value || '560001',
      type: 'Home'
    };
  }

  const overlay = document.getElementById('payment-processing-overlay');
  if (overlay) overlay.classList.add('open');

  const pStep1 = document.getElementById('p-step-1');
  const pStep2 = document.getElementById('p-step-2');
  const pStep3 = document.getElementById('p-step-3');

  setTimeout(() => { if (pStep1) pStep1.classList.add('done'); if (pStep2) pStep2.classList.add('active'); }, 700);
  setTimeout(() => { if (pStep2) pStep2.classList.add('done'); if (pStep3) pStep3.classList.add('active'); }, 1400);

  setTimeout(() => {
    if (overlay) overlay.classList.remove('open');

    // Create Order Record
    let subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let tax = Math.round(subtotal * 0.05);
    let discount = promoApplied ? Math.round(subtotal * 0.2) : 0;
    let grandTotal = subtotal + tax - discount;

    const orderId = '#BH-' + Math.floor(100000 + Math.random() * 900000);
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    // Delivery estimated 3 days later
    const deliveryDate = new Date(now.setDate(now.getDate() + 3));
    const estDeliveryStr = deliveryDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    let methodDisplay = 'Credit / Debit Card (•••• 4242)';
    if (selectedPaymentMethod === 'upi') methodDisplay = 'UPI / QR Code (bookhive@upi)';
    if (selectedPaymentMethod === 'netbanking') methodDisplay = 'Net Banking (HDFC Bank)';
    if (selectedPaymentMethod === 'cod') methodDisplay = 'Cash on Delivery';

    const newOrder = {
      id: orderId,
      date: dateStr,
      status: 'In Transit',
      paymentMethod: methodDisplay,
      shippingAddress: { ...checkoutShippingInfo },
      items: [...cart],
      subtotal: subtotal,
      tax: tax,
      discount: discount,
      total: grandTotal,
      estimatedDelivery: estDeliveryStr
    };

    orders.unshift(newOrder);
    localStorage.setItem('bookhive_orders', JSON.stringify(orders));

    // Clear cart state
    cart = [];
    promoApplied = false;
    saveCart();

    // Render receipt view
    renderOrderConfirmation(newOrder);
    goToStep(3);

    // Hide summary sidebar on step 3
    const sidebar = document.getElementById('checkout-summary-sidebar');
    if (sidebar) sidebar.style.display = 'none';
    const layout = document.getElementById('checkout-layout-grid');
    if (layout) layout.style.gridTemplateColumns = '1fr';

  }, 2200);
}

function renderOrderConfirmation(order) {
  const confirmedIdEl = document.getElementById('confirmed-order-id');
  const receiptContainer = document.getElementById('order-receipt-content');
  if (confirmedIdEl) confirmedIdEl.innerText = order.id;

  if (!receiptContainer) return;

  let itemsRows = '';
  order.items.forEach(item => {
    itemsRows += `
      <div class="receipt-item-row">
        <span>${item.title} (×${item.quantity})</span>
        <span>₹${item.price * item.quantity}</span>
      </div>
    `;
  });

  receiptContainer.innerHTML = `
    <div class="receipt-card">
      <div class="receipt-header">
        <h4><i class="fas fa-receipt"></i> Purchase Receipt & Order Summary</h4>
        <span class="receipt-date">${order.date}</span>
      </div>

      <div class="receipt-body">
        <div class="receipt-section">
          <h5>Items Ordered</h5>
          ${itemsRows}
        </div>

        <div class="receipt-section">
          <div class="receipt-calc-row">
            <span>Subtotal</span>
            <span>₹${order.subtotal}</span>
          </div>
          <div class="receipt-calc-row">
            <span>Shipping</span>
            <span style="color: #16a34a; font-weight:600;">FREE</span>
          </div>
          <div class="receipt-calc-row">
            <span>GST / Tax (5%)</span>
            <span>₹${order.tax}</span>
          </div>
          ${order.discount > 0 ? `
            <div class="receipt-calc-row">
              <span>Promo Discount</span>
              <span style="color: #16a34a; font-weight:600;">-₹${order.discount}</span>
            </div>
          ` : ''}
          <div class="receipt-calc-row total">
            <span>Grand Total Paid</span>
            <span>₹${order.total}</span>
          </div>
        </div>

        <div class="receipt-info-grid">
          <div>
            <h5><i class="fas fa-truck"></i> Shipping Address</h5>
            <p><strong>${order.shippingAddress.name}</strong></p>
            <p>${order.shippingAddress.address}</p>
            <p>${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}</p>
            <p>Phone: ${order.shippingAddress.phone}</p>
          </div>
          <div>
            <h5><i class="fas fa-credit-card"></i> Payment Method</h5>
            <p>${order.paymentMethod}</p>
            <p style="margin-top: 8px;"><strong>Estimated Delivery:</strong></p>
            <p style="color: #ff9800; font-weight: 700;">${order.estimatedDelivery}</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

/* ==========================================================
   ORDER HISTORY DASHBOARD LOGIC (orders.html)
   ========================================================== */

function filterOrders(statusFilter, btn) {
  const btns = document.querySelectorAll('.order-filter-btn');
  btns.forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  renderOrdersPage(statusFilter);
}

function renderOrdersPage(filter = 'all') {
  const container = document.getElementById('orders-list-container');
  if (!container) return;

  let filteredOrders = orders;
  if (filter === 'active') {
    filteredOrders = orders.filter(o => o.status === 'In Transit' || o.status === 'Processing');
  } else if (filter === 'delivered') {
    filteredOrders = orders.filter(o => o.status === 'Delivered');
  }

  if (filteredOrders.length === 0) {
    container.innerHTML = `
      <div class="orders-empty-card">
        <i class="fas fa-box-open" style="font-size: 64px; color: #d1d5db; margin-bottom: 16px;"></i>
        <h3>No Orders Found</h3>
        <p>You have no ${filter !== 'all' ? filter : ''} orders placed yet.</p>
        <a href="books.html" class="continue-shopping-btn" style="background: #ff9800; color: #fff; text-decoration: none; display: inline-block; margin-top: 16px; padding: 10px 24px; border-radius: 25px;"><i class="fas fa-book"></i> Explore Books Catalog</a>
      </div>
    `;
    return;
  }

  let html = '';
  filteredOrders.forEach((order, index) => {
    let statusClass = 'status-in-transit';
    if (order.status === 'Delivered') statusClass = 'status-delivered';
    if (order.status === 'Processing') statusClass = 'status-processing';

    let itemsHtml = '';
    order.items.forEach(item => {
      itemsHtml += `
        <div class="order-item-row">
          <img src="${item.image || 'books img/1.jpg'}" alt="${item.title}">
          <div class="order-item-detail">
            <h4>${item.title}</h4>
            <div class="order-item-meta">Qty: ${item.quantity} × ₹${item.price}</div>
          </div>
          <div class="order-item-price">₹${item.price * item.quantity}</div>
        </div>
      `;
    });

    html += `
      <div class="order-history-card">
        <div class="order-card-header">
          <div class="order-header-main">
            <div class="order-id-title">${order.id}</div>
            <div class="order-date"><i class="far fa-calendar-alt"></i> Placed on ${order.date}</div>
          </div>
          <div class="order-header-right">
            <span class="order-status-badge ${statusClass}">
              <i class="fas ${order.status === 'Delivered' ? 'fa-check-circle' : 'fa-shipping-fast'}"></i> ${order.status}
            </span>
            <div class="order-amount-display">₹${order.total}</div>
          </div>
        </div>

        <!-- SHIPMENT TRACKING TIMELINE -->
        <div class="shipment-timeline-wrapper">
          <div class="timeline-step done">
            <div class="timeline-dot"><i class="fas fa-check"></i></div>
            <span>Order Placed</span>
          </div>
          <div class="timeline-step ${order.status !== 'Pending' ? 'done' : ''}">
            <div class="timeline-dot"><i class="fas fa-box"></i></div>
            <span>Processing</span>
          </div>
          <div class="timeline-step ${order.status === 'In Transit' || order.status === 'Delivered' ? 'done active-step' : ''}">
            <div class="timeline-dot"><i class="fas fa-truck"></i></div>
            <span>In Transit</span>
          </div>
          <div class="timeline-step ${order.status === 'Delivered' ? 'done' : ''}">
            <div class="timeline-dot"><i class="fas fa-home"></i></div>
            <span>Delivered</span>
          </div>
        </div>

        <!-- ORDER ITEMS & ADDRESS -->
        <div class="order-card-body">
          <div class="order-items-column">
            ${itemsHtml}
          </div>
          <div class="order-shipping-column">
            <h5><i class="fas fa-map-marker-alt" style="color: #ff9800;"></i> Delivery Address</h5>
            <p><strong>${order.shippingAddress.name}</strong></p>
            <p>${order.shippingAddress.address}</p>
            <p>${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}</p>
            <p style="margin-top: 10px; font-size: 13px; color: #4b5563;">
              <strong>Est. Delivery:</strong> <span style="color: #ff9800; font-weight:700;">${order.estimatedDelivery || 'Jul 29, 2026'}</span>
            </p>
          </div>
        </div>

        <!-- CARD FOOTER ACTIONS -->
        <div class="order-card-footer">
          <span>Payment: <strong>${order.paymentMethod}</strong></span>
          <div class="order-actions-btns">
            <button class="reorder-btn" onclick="reorderItems(${index})"><i class="fas fa-redo"></i> Buy Again</button>
            <button class="track-btn" onclick="showToast('Tracking details: Parcel is at regional sorting facility')"><i class="fas fa-location-arrow"></i> Track Parcel</button>
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

function reorderItems(orderIndex) {
  const targetOrder = orders[orderIndex];
  if (!targetOrder || !targetOrder.items) return;

  targetOrder.items.forEach(item => {
    const existingIndex = cart.findIndex(c => c.title === item.title);
    if (existingIndex > -1) {
      cart[existingIndex].quantity += (item.quantity || 1);
    } else {
      cart.push({ ...item });
    }
  });

  saveCart();
  showToast(`Re-added ${targetOrder.items.length} items from ${targetOrder.id} to cart! <a href="cart.html" style="color:#ff9800; font-weight:700; text-decoration:underline;">View Cart →</a>`);
}

function injectCartMarkup() {
  if (!document.getElementById('cart-sidebar')) {
    const backdrop = document.createElement('div');
    backdrop.id = 'cart-backdrop';
    backdrop.onclick = closeCartSidebar;

    const sidebar = document.createElement('div');
    sidebar.id = 'cart-sidebar';
    sidebar.innerHTML = `
      <div class="cart-header">
        <h3><i class="fas fa-shopping-cart" style="color: #ff9800;"></i> Shopping Cart</h3>
        <button class="close-cart-btn" onclick="closeCartSidebar()"><i class="fas fa-times"></i></button>
      </div>
      <div class="cart-items-body" id="cart-items-body"></div>
      <div class="cart-footer" id="cart-footer-content">
        <div class="cart-summary-row">
          <span>Subtotal</span>
          <span id="cart-subtotal">₹0</span>
        </div>
        <div class="cart-summary-row">
          <span>Shipping</span>
          <span style="color: #16a34a; font-weight: 700;">FREE</span>
        </div>
        <div class="cart-summary-row total">
          <span>Total</span>
          <span id="cart-total">₹0</span>
        </div>
        <a href="cart.html" class="checkout-btn" style="text-decoration: none;">View Cart & Checkout <i class="fas fa-arrow-right"></i></a>
        <button class="clear-cart-btn" onclick="clearCart()">Clear Cart</button>
      </div>
    `;

    document.body.appendChild(backdrop);
    document.body.appendChild(sidebar);
  }

  // Inject Auth Modal if not present
  if (!document.getElementById('login-modal')) {
    const modalBackdrop = document.createElement('div');
    modalBackdrop.id = 'login-modal-backdrop';
    modalBackdrop.className = 'modal-backdrop';
    modalBackdrop.onclick = closeLoginModal;

    const modal = document.createElement('div');
    modal.id = 'login-modal';
    modal.className = 'auth-modal';
    modal.innerHTML = `
      <button class="close-modal-btn" onclick="closeLoginModal()"><i class="fas fa-times"></i></button>
      <div class="auth-card-modal">
        <div class="auth-header">
          <div class="auth-logo"><i class="fas fa-book-open"></i></div>
          <h2>Welcome to <span>BookHive</span></h2>
          <p>Sign in to access your orders, wishlist, and recommendations</p>
        </div>

        <div class="auth-tabs">
          <button class="auth-tab active" id="modal-tab-login-btn" onclick="switchModalAuthTab('login')">Log In</button>
          <button class="auth-tab" id="modal-tab-signup-btn" onclick="switchModalAuthTab('signup')">Sign Up</button>
        </div>

        <form id="modal-login-form" class="auth-form active" onsubmit="handleModalLoginSubmit(event)">
          <div class="form-group">
            <label>Email Address</label>
            <div class="input-wrapper">
              <i class="far fa-envelope"></i>
              <input type="email" id="modal-login-email" value="jaswanthmg2006@gmail.com" placeholder="name@example.com" required>
            </div>
          </div>

          <div class="form-group">
            <div class="label-row">
              <label>Password</label>
              <a href="#" onclick="alert('Password reset link has been sent to your email!')" class="forgot-link">Forgot password?</a>
            </div>
            <div class="input-wrapper">
              <i class="fas fa-lock"></i>
              <input type="password" id="modal-login-password" value="Jashh@123" placeholder="Enter your password" required>
              <i class="far fa-eye toggle-pwd" onclick="togglePasswordVisibility('modal-login-password', this)"></i>
            </div>
          </div>

          <div class="form-options">
            <label class="checkbox-label">
              <input type="checkbox" checked> Remember me for 30 days
            </label>
          </div>

          <button type="submit" class="auth-submit-btn">Sign In <i class="fas fa-arrow-right"></i></button>

          <div class="auth-divider"><span>OR CONTINUE WITH</span></div>

          <div class="social-auth-btns">
            <button type="button" class="social-btn" onclick="demoSocialLogin('Google')">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google"> Google
            </button>
            <button type="button" class="social-btn" onclick="demoSocialLogin('Apple')">
              <i class="fab fa-apple" style="font-size: 18px; color: #000;"></i> Apple
            </button>
          </div>
        </form>

        <form id="modal-signup-form" class="auth-form" onsubmit="handleModalSignupSubmit(event)">
          <div class="form-group">
            <label>Full Name</label>
            <div class="input-wrapper">
              <i class="far fa-user"></i>
              <input type="text" id="modal-signup-name" placeholder="Jaswanth" required>
            </div>
          </div>

          <div class="form-group">
            <label>Email Address</label>
            <div class="input-wrapper">
              <i class="far fa-envelope"></i>
              <input type="email" id="modal-signup-email" placeholder="jaswanthmg2006@gmail.com" required>
            </div>
          </div>

          <div class="form-group">
            <label>Create Password</label>
            <div class="input-wrapper">
              <i class="fas fa-lock"></i>
              <input type="password" id="modal-signup-password" placeholder="At least 6 characters" required minlength="6">
              <i class="far fa-eye toggle-pwd" onclick="togglePasswordVisibility('modal-signup-password', this)"></i>
            </div>
          </div>

          <button type="submit" class="auth-submit-btn">Create Account <i class="fas fa-user-plus"></i></button>
        </form>
      </div>
    `;

    document.body.appendChild(modalBackdrop);
    document.body.appendChild(modal);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  injectCartMarkup();
  updateCartUI();
  updateUserUI();

  if (document.getElementById('checkout-items-list')) {
    renderCheckoutPage();
  }

  if (document.getElementById('orders-list-container')) {
    renderOrdersPage('all');
  }

  const bgVideo = document.getElementById('hero-bg-video');
  if (bgVideo) {
    const videos = ['bgvideo1.mp4', 'bgvideo2.mp4'];
    let currentVideo = 0;
    bgVideo.playbackRate = 0.5;
    bgVideo.play().catch(e => console.log("Autoplay prevented:", e));

    bgVideo.addEventListener('ended', () => {
      currentVideo = (currentVideo + 1) % videos.length;
      bgVideo.src = videos[currentVideo];
      bgVideo.play();
      bgVideo.playbackRate = 0.5;
    });
  }
});