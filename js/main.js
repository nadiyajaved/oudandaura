/**
 * Oud & Aura - Main Shared Interaction & Navigation Script
 */

// Shopping Cart State Management (Persistent via localStorage)
const CART_STORAGE_KEY = "oud_aura_cart";

function getCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    updateCartBadges();
  } catch (e) {
    console.error("Failed to save cart", e);
  }
}

function addToCart(productId, size, price, quantity = 1) {
  const cart = getCart();
  const existingIndex = cart.findIndex(item => item.id === productId && item.size === size);
  if (existingIndex > -1) {
    cart[existingIndex].quantity += quantity;
  } else {
    const product = typeof getProductById === "function" ? getProductById(productId) : null;
    cart.push({
      id: productId,
      name: product ? product.name : productId,
      size: size || (product ? product.size : ""),
      price: price || (product ? product.price : 0),
      image: product && product.images && product.images[0] ? product.images[0] : "",
      quantity: quantity
    });
  }
  saveCart(cart);
  showToast(`Added to Bag`);
  renderCartDrawer();
  openCartDrawer();
}

function removeFromCart(index) {
  const cart = getCart();
  if (index >= 0 && index < cart.length) {
    cart.splice(index, 1);
    saveCart(cart);
    renderCartDrawer();
  }
}

function updateCartQuantity(index, delta) {
  const cart = getCart();
  if (cart[index]) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }
    saveCart(cart);
    renderCartDrawer();
  }
}

function updateCartBadges() {
  const cart = getCart();
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll(".cart-count-badge").forEach(badge => {
    badge.textContent = totalCount;
    badge.style.display = totalCount > 0 ? "flex" : "none";
  });
}

// Toast notification helper
function showToast(message) {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.classList.add("show"), 10);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// Mobile Menu Drawer
function setupMobileMenu() {
  const menuBtn = document.getElementById("openMenuBtn");
  const closeBtn = document.getElementById("closeMenuBtn");
  const drawer = document.getElementById("mobileMenuDrawer");
  const backdrop = document.getElementById("mobileMenuBackdrop");

  if (menuBtn && drawer && backdrop) {
    menuBtn.addEventListener("click", () => {
      drawer.classList.add("active");
      backdrop.classList.add("active");
      document.body.style.overflow = "hidden";
    });

    const close = () => {
      drawer.classList.remove("active");
      backdrop.classList.remove("active");
      document.body.style.overflow = "";
    };

    if (closeBtn) closeBtn.addEventListener("click", close);
    backdrop.addEventListener("click", close);
  }
}

// Shopping Bag Drawer
function setupCartDrawer() {
  const bagBtns = document.querySelectorAll(".openCartBtn");
  const closeBtn = document.getElementById("closeCartBtn");
  const drawer = document.getElementById("cartDrawer");
  const backdrop = document.getElementById("cartBackdrop");

  bagBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      renderCartDrawer();
      openCartDrawer();
    });
  });

  const close = () => {
    if (drawer) drawer.classList.remove("active");
    if (backdrop) backdrop.classList.remove("active");
    document.body.style.overflow = "";
  };

  if (closeBtn) closeBtn.addEventListener("click", close);
  if (backdrop) backdrop.addEventListener("click", close);
}

function openCartDrawer() {
  const drawer = document.getElementById("cartDrawer");
  const backdrop = document.getElementById("cartBackdrop");
  if (drawer && backdrop) {
    drawer.classList.add("active");
    backdrop.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

function renderCartDrawer() {
  const list = document.getElementById("cartItemsList");
  const subtotalEl = document.getElementById("cartSubtotal");
  const whatsappCheckoutBtn = document.getElementById("cartWhatsAppCheckout");
  if (!list) return;

  const cart = getCart();
  if (cart.length === 0) {
    list.innerHTML = `
      <div class="flex flex-col items-center justify-center h-64 text-center text-on-surface-variant p-6">
        <span class="material-symbols-outlined text-4xl text-secondary mb-2">shopping_bag</span>
        <p class="font-headline-sm text-base text-primary">Your bag is empty</p>
        <p class="font-body-sm text-xs mt-1">Discover our perfumes, attars and gift sets.</p>
        <a href="shop.html" class="mt-4 px-6 py-2 bg-primary text-on-primary font-label-caps text-xs uppercase tracking-wider rounded">
          Explore Collection
        </a>
      </div>
    `;
    if (subtotalEl) subtotalEl.textContent = `${SITE_CONFIG.currencySymbol}0`;
    if (whatsappCheckoutBtn) {
      whatsappCheckoutBtn.classList.add("opacity-50", "pointer-events-none");
    }
    return;
  }

  let subtotal = 0;
  list.innerHTML = cart.map((item, idx) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;
    return `
      <div class="flex gap-3 p-3 bg-surface-container-low rounded-lg border border-[#E5DDCF]/60 items-center">
        <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded bg-surface-container flex-shrink-0" onerror="this.src='https://via.placeholder.com/100?text=Oud'" />
        <div class="flex-1 min-w-0">
          <h4 class="font-headline-sm text-sm text-primary truncate">${item.name}</h4>
          <span class="font-label-caps text-[10px] text-secondary">${item.size}</span>
          <div class="flex items-center justify-between mt-2">
            <span class="font-body-md text-xs font-semibold text-primary">${SITE_CONFIG.currencySymbol}${item.price}</span>
            <div class="flex items-center border border-[#E5DDCF] rounded bg-surface">
              <button onclick="updateCartQuantity(${idx}, -1)" class="w-6 h-6 flex items-center justify-center text-primary hover:bg-surface-container text-xs">-</button>
              <span class="px-2 text-xs font-medium">${item.quantity}</span>
              <button onclick="updateCartQuantity(${idx}, 1)" class="w-6 h-6 flex items-center justify-center text-primary hover:bg-surface-container text-xs">+</button>
            </div>
          </div>
        </div>
        <button onclick="removeFromCart(${idx})" class="text-on-surface-variant hover:text-error p-1" title="Remove item">
          <span class="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>
    `;
  }).join("");

  if (subtotalEl) {
    subtotalEl.textContent = `${SITE_CONFIG.currencySymbol}${subtotal}`;
  }

  if (whatsappCheckoutBtn) {
    whatsappCheckoutBtn.classList.remove("opacity-50", "pointer-events-none");
    
    // Construct summarized WhatsApp order message
    let orderLines = cart.map(item => `- ${item.name} (${item.size}) x${item.quantity} : ${SITE_CONFIG.currencySymbol}${item.price * item.quantity}`).join("\n");
    let fullMsg = `Hi Oud & Aura, I would like to place an order:\n\n${orderLines}\n\nTotal: ${SITE_CONFIG.currencySymbol}${subtotal}\n\nPlease confirm availability and payment details.`;
    whatsappCheckoutBtn.href = SITE_CONFIG.getWhatsAppUrl(fullMsg);
  }
}

// Search Modal
function setupSearchModal() {
  const searchBtns = document.querySelectorAll(".openSearchBtn");
  const modal = document.getElementById("searchModal");
  const closeBtn = document.getElementById("closeSearchBtn");
  const input = document.getElementById("globalSearchInput");
  const resultsContainer = document.getElementById("searchResults");

  if (!modal) return;

  const openSearch = () => {
    modal.classList.remove("hidden");
    if (input) {
      input.value = "";
      setTimeout(() => input.focus(), 50);
    }
    renderSearchResults("");
    document.body.style.overflow = "hidden";
  };

  const closeSearch = () => {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  };

  searchBtns.forEach(btn => btn.addEventListener("click", openSearch));
  if (closeBtn) closeBtn.addEventListener("click", closeSearch);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeSearch();
  });

  if (input) {
    input.addEventListener("input", (e) => {
      renderSearchResults(e.target.value.trim());
    });
  }

  function renderSearchResults(query) {
    if (!resultsContainer) return;
    const all = typeof getAllProducts === "function" ? getAllProducts() : [];
    const filtered = query 
      ? all.filter(p => 
          p.name.toLowerCase().includes(query.toLowerCase()) || 
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.shortDescription.toLowerCase().includes(query.toLowerCase()) ||
          (p.notes && (p.notes.top + p.notes.heart + p.notes.base).toLowerCase().includes(query.toLowerCase()))
        )
      : all.slice(0, 4); // show initial 4 suggestions

    if (filtered.length === 0) {
      resultsContainer.innerHTML = `
        <div class="py-8 text-center text-on-surface-variant font-body-sm text-sm">
          No fragrances matched "${query}". Try searching "Oud", "Musk", or "Attar".
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = `
      <div class="text-xs font-label-caps uppercase text-secondary tracking-wider mb-2">
        ${query ? `Results (${filtered.length})` : 'Popular Fragrances'}
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
        ${filtered.map(p => `
          <a href="product.html?id=${p.id}" class="flex items-center gap-3 p-2 rounded-lg bg-surface-container hover:bg-[#E5DDCF]/70 transition-colors">
            <img src="${p.images[0]}" alt="${p.name}" class="w-12 h-12 rounded object-cover bg-surface-container-low flex-shrink-0" />
            <div class="min-w-0 flex-1">
              <h4 class="font-headline-sm text-sm text-primary truncate">${p.name}</h4>
              <span class="font-label-caps text-[10px] text-secondary block">${p.size} · ${p.concentration}</span>
              <span class="font-body-md text-xs font-semibold text-primary">${SITE_CONFIG.currencySymbol}${p.price}</span>
            </div>
          </a>
        `).join("")}
      </div>
    `;
  }
}

// Hydrate Global Placeholders and Active Links
function hydrateSite() {
  // Update all elements with configurable attributes
  document.querySelectorAll("[data-config='whatsapp-link']").forEach(el => {
    el.href = SITE_CONFIG.getWhatsAppUrl();
  });
  document.querySelectorAll("[data-config='whatsapp-number']").forEach(el => {
    el.textContent = SITE_CONFIG.whatsappDisplayNumber;
  });
  document.querySelectorAll("[data-config='instagram-link']").forEach(el => {
    el.href = SITE_CONFIG.instagramUrl;
  });
  document.querySelectorAll("[data-config='instagram-handle']").forEach(el => {
    el.textContent = SITE_CONFIG.instagramHandle;
  });
  document.querySelectorAll("[data-config='contact-email']").forEach(el => {
    if (el.tagName !== 'A') {
      el.textContent = SITE_CONFIG.contactEmail;
    } else {
      el.href = `mailto:${SITE_CONFIG.contactEmail}`;
    }
  });
  document.querySelectorAll("[data-config='email-link']").forEach(el => {
    el.href = `mailto:${SITE_CONFIG.contactEmail}`;
  });
  document.querySelectorAll("[data-config='brand-subtitle']").forEach(el => {
    el.textContent = SITE_CONFIG.brandSubtitle;
  });
  // Also update header subtitle if present
  document.querySelectorAll(".header-subtitle").forEach(el => {
    el.textContent = SITE_CONFIG.brandSubtitle;
  });

  // Mark active navigation items
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("a[data-nav]").forEach(link => {
    const target = link.getAttribute("data-nav");
    if (
      (currentPath === "index.html" || currentPath === "") && target === "home" ||
      currentPath.includes("shop") && target === "shop" ||
      currentPath.includes("about") && target === "about" ||
      currentPath.includes("contact") && target === "contact"
    ) {
      link.classList.add("text-primary", "font-semibold");
      link.classList.remove("text-on-surface-variant");
    }
  });

  updateCartBadges();
}

// Initialise everything when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  hydrateSite();
  setupMobileMenu();
  setupCartDrawer();
  setupSearchModal();
});
