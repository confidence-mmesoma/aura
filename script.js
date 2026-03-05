const CART_KEY = "aura_cart_v1";
const FREE_SHIPPING_THRESHOLD = 120;
// DEMO CHECKOUT START
const SHIPMENT_KEY = "aura_last_shipment";
// DEMO CHECKOUT END

// Single product source used by all pages
const PRODUCTS = [
  {
    id: 1,
    name: "Tailored Wool Blazer",
    category: "men",
    price: 189,
    oldPrice: 229,
    image: "./assets/download (16).jpeg",
    colors: ["Black", "Navy", "Slate"],
    sizes: ["S", "M", "L", "XL"],
    rating: 4.8,
    reviews: 128,
    bestSeller: true,
    isNew: false,
    badge: "Best Seller",
    description: "Structured blazer in breathable wool blend for office and evening looks.",
  },
  {
    id: 2,
    name: "Linen Resort Set",
    category: "women",
    price: 149,
    oldPrice: 179,
    image: "./assets/couplewear.jpeg",
    colors: ["Ivory", "Sand", "Olive"],
    sizes: ["XS", "S", "M", "L"],
    rating: 4.7,
    reviews: 96,
    bestSeller: false,
    isNew: true,
    badge: "New",
    description: "Soft linen set made for warm weather and easy day to night styling.",
  },
  {
    id: 3,
    name: "Classic City Trench",
    category: "women",
    price: 169,
    oldPrice: 210,
    image: "./assets/download (15).jpeg",
    colors: ["Sand", "Black", "Navy"],
    sizes: ["S", "M", "L"],
    rating: 4.6,
    reviews: 74,
    bestSeller: false,
    isNew: true,
    badge: "Limited",
    description: "Water resistant trench with removable belt and satin lining.",
  },
  {
    id: 4,
    name: "Monochrome Knit Polo",
    category: "men",
    price: 89,
    oldPrice: 110,
    image: "./assets/download (21).jpeg",
    colors: ["Black", "Ivory", "Olive"],
    sizes: ["S", "M", "L", "XL"],
    rating: 4.5,
    reviews: 63,
    bestSeller: true,
    isNew: false,
    badge: "Core",
    description: "Premium knit polo with a slim modern cut and soft finish.",
  },
  {
    id: 5,
    name: "Signature Hoop Set",
    category: "accessories",
    price: 49,
    oldPrice: 65,
    image: "./assets/earing.jpeg",
    colors: ["Gold", "Silver", "Black"],
    sizes: ["One Size"],
    rating: 4.4,
    reviews: 41,
    bestSeller: true,
    isNew: false,
    badge: "Gift Pick",
    description: "Polished hoop set in 3 tones to complete everyday looks.",
  },
  {
    id: 6,
    name: "Minimal Crossbody Bag",
    category: "accessories",
    price: 119,
    oldPrice: 145,
    image: "./assets/crossbag.jpeg",
    colors: ["Black", "Sand", "Olive"],
    sizes: ["One Size"],
    rating: 4.9,
    reviews: 155,
    bestSeller: true,
    isNew: true,
    badge: "Top Rated",
    description: "Compact crossbody with secure compartments and adjustable strap.",
  },
  {
    id: 7,
    name: "Fluid Wide Leg Trousers",
    category: "women",
    price: 109,
    oldPrice: 135,
    image: "./assets/wideleg.jpeg",
    colors: ["Navy", "Black", "Ivory"],
    sizes: ["XS", "S", "M", "L"],
    rating: 4.5,
    reviews: 52,
    bestSeller: false,
    isNew: false,
    badge: "Editor Pick",
    description: "High waist drape trousers for workdays and evenings.",
  },
  {
    id: 8,
    name: "Weekend Utility Jacket",
    category: "men",
    price: 139,
    oldPrice: 170,
    image: "./assets/weekendjacket.jpeg",
    colors: ["Olive", "Black", "Slate"],
    sizes: ["M", "L", "XL"],
    rating: 4.6,
    reviews: 80,
    bestSeller: false,
    isNew: true,
    badge: "Just In",
    description: "Clean utility jacket with hidden pockets and matte hardware.",
  },
];

const colorHexMap = {
  Black: "#1f1f1f",
  Navy: "#2d3a61",
  Slate: "#5e6570",
  Sand: "#d6c2aa",
  Ivory: "#f4efe6",
  Olive: "#5f6651",
  Gold: "#b08a58",
  Silver: "#a6a6a6",
};

const shopState = {
  category: "all",
  color: "all",
  sort: "featured",
  query: "",
  selectedProductId: null,
  selectedColor: "",
  selectedSize: "",
  selectedQty: 1,
};

function getPage() {
  return document.body.dataset.page || "";
}

// PRELOADER START ==================
function createPreloaderNode() {
  const existing = document.getElementById("page-preloader");
  if (existing) return existing;

  const wrapper = document.createElement("div");
  wrapper.id = "page-preloader";
  wrapper.className = "page-preloader";
  wrapper.setAttribute("aria-hidden", "true");
  wrapper.innerHTML = `
    <div class="preloader-inner">
      <h2 class="preloader-brand" aria-label="AURA">
        <span class="preloader-letter">A</span>
        <span class="preloader-letter">U</span>
        <span class="preloader-letter">R</span>
        <span class="preloader-letter">A</span>
      </h2>
      <div class="preloader-line"></div>
    </div>
  `;
  document.body.appendChild(wrapper);
  return wrapper;
}

function showPreloader() {
  const preloader = createPreloaderNode();
  preloader.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-loading");
}

function hidePreloader() {
  const preloader = document.getElementById("page-preloader");
  if (!preloader) return;
  preloader.setAttribute("aria-hidden", "true");
  document.body.classList.remove("is-loading");
}

function shouldUsePreloaderForLink(link, event) {
  if (event.defaultPrevented) return false;
  if (event.button !== 0) return false;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
  if (link.target === "_blank") return false;
  if (link.hasAttribute("download")) return false;

  const rawHref = link.getAttribute("href") || "";
  if (!rawHref || rawHref.startsWith("#")) return false;
  if (rawHref.startsWith("mailto:") || rawHref.startsWith("tel:")) return false;
  if (rawHref.startsWith("javascript:")) return false;

  const targetUrl = new URL(link.href, window.location.href);
  if (targetUrl.origin !== window.location.origin) return false;

  return targetUrl.href !== window.location.href;
}

function initPagePreloader() {
  createPreloaderNode();
  hidePreloader();

  document.querySelectorAll("a[href]").forEach((link) => {
    link.addEventListener("click", (event) => {
      if (!shouldUsePreloaderForLink(link, event)) return;
      event.preventDefault();
      showPreloader();
      const nextUrl = link.href;
      setTimeout(() => {
        window.location.href = nextUrl;
      }, 1200);
    });
  });

  window.addEventListener("pageshow", hidePreloader);
}
// PRELOADER END ====================

// MenuToggle start================
function initMobileMenu() {
  const toggle = document.getElementById("menu-toggle");
  const mobileNav = document.getElementById("mobile-nav");
  if (!toggle || !mobileNav) return;

  toggle.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("menu-open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      document.body.classList.remove("menu-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) {
      document.body.classList.remove("menu-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}
// MenToggle end===================

function formatPrice(price) {
  return `$${price.toFixed(2)}`;
}

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function setCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

// DEMO CHECKOUT START
function getShipment() {
  return JSON.parse(localStorage.getItem(SHIPMENT_KEY)) || null;
}

function setShipment(data) {
  localStorage.setItem(SHIPMENT_KEY, JSON.stringify(data));
}
// DEMO CHECKOUT END

function cartCount(items) {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

function cartSubtotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function updateHeaderBag() {
  const bagButton = document.getElementById("header-bag-btn");
  if (!bagButton) return;
  const items = getCart();
  bagButton.textContent = `Bag (${cartCount(items)})`;
}

// Merge same product + color + size in cart
function addItemToCart({ id, name, price, image, color, size, quantity }) {
  const items = getCart();
  const existing = items.find(
    (item) => item.id === id && item.color === color && item.size === size,
  );

  if (existing) {
    existing.quantity += quantity;
  } else {
    items.push({ id, name, price, image, color, size, quantity });
  }

  setCart(items);
  updateHeaderBag();
}

function findProductById(id) {
  return PRODUCTS.find((product) => product.id === Number(id));
}

function buildFilteredProducts() {
  let list = [...PRODUCTS];

  if (shopState.category !== "all") {
    if (shopState.category === "new") {
      list = list.filter((product) => product.isNew);
    } else {
      list = list.filter((product) => product.category === shopState.category);
    }
  }

  if (shopState.color !== "all") {
    list = list.filter((product) => product.colors.includes(shopState.color));
  }

  if (shopState.query.trim()) {
    const text = shopState.query.trim().toLowerCase();
    list = list.filter((product) => {
      return (
        product.name.toLowerCase().includes(text) ||
        product.description.toLowerCase().includes(text) ||
        product.category.toLowerCase().includes(text)
      );
    });
  }

  if (shopState.sort === "price-low") {
    list.sort((a, b) => a.price - b.price);
  } else if (shopState.sort === "price-high") {
    list.sort((a, b) => b.price - a.price);
  } else if (shopState.sort === "best-selling") {
    list.sort((a, b) => {
      const aScore = (a.bestSeller ? 100 : 0) + a.reviews;
      const bScore = (b.bestSeller ? 100 : 0) + b.reviews;
      return bScore - aScore;
    });
  }

  return list;
}

function swatchHtml(color) {
  const hex = colorHexMap[color] || "#ccc";
  return `<span class="swatch" title="${color}" style="background:${hex};"></span>`;
}

function renderShopGrid() {
  const grid = document.getElementById("shop-grid");
  const resultsCount = document.getElementById("results-count");
  if (!grid || !resultsCount) return;

  const list = buildFilteredProducts();
  resultsCount.textContent = `${list.length} product${list.length === 1 ? "" : "s"}`;

  if (!list.length) {
    grid.innerHTML = `
      <article class="product-card">
        <div class="product-info">
          <h3>No products found</h3>
          <p>Try another category, color, or search term.</p>
        </div>
      </article>
    `;
    return;
  }

  grid.innerHTML = list
    .map((product) => {
      return `
        <article class="product-card">
          <img src="${product.image}" alt="${product.name}" />
          <div class="product-info">
            <div class="badge-row">
              <span class="badge">${product.badge}</span>
              <span class="old-price">${formatPrice(product.oldPrice)}</span>
            </div>
            <h3>${product.name}</h3>
            <p class="price">${formatPrice(product.price)}</p>
            <div class="swatch-row">${product.colors.map(swatchHtml).join("")}</div>
            <div class="meta-row">
              <span>${product.rating} (${product.reviews})</span>
              <span>${product.category}</span>
            </div>
            <button class="quick-add-btn" data-open-id="${product.id}">View Options</button>
          </div>
        </article>
      `;
    })
    .join("");
}

function setActiveFilterButton(category) {
  const buttons = document.querySelectorAll("#category-filters .filter-btn");
  buttons.forEach((button) => {
    button.classList.toggle("active", button.dataset.category === category);
  });
}

function setCategoryFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const category = params.get("category");
  if (!category) return;
  const valid = ["all", "men", "women", "accessories", "new"];
  if (valid.includes(category)) {
    shopState.category = category;
    setActiveFilterButton(category);
  }
}

function openProductModal(productId) {
  const modal = document.getElementById("product-modal");
  const body = document.getElementById("modal-body");
  const product = findProductById(productId);
  if (!modal || !body || !product) return;

  shopState.selectedProductId = product.id;
  shopState.selectedColor = product.colors[0];
  shopState.selectedSize = product.sizes[0];
  shopState.selectedQty = 1;

  body.innerHTML = `
    <div class="modal-layout">
      <img src="${product.image}" alt="${product.name}" />
      <div>
        <p class="modal-overline">${product.badge}</p>
        <h2 class="modal-title">${product.name}</h2>
        <p class="modal-description">${product.description}</p>
        <div class="modal-price-row">
          <strong>${formatPrice(product.price)}</strong>
          <span class="old-price">${formatPrice(product.oldPrice)}</span>
        </div>

        <div class="variant-group">
          <label>Color</label>
          <div class="variant-options" id="modal-color-options">
            ${product.colors
              .map(
                (color, index) => `
                  <button class="variant-btn ${index === 0 ? "active" : ""}" data-modal-color="${color}">
                    ${color}
                  </button>
                `,
              )
              .join("")}
          </div>
        </div>

        <div class="variant-group">
          <label>Size</label>
          <div class="variant-options" id="modal-size-options">
            ${product.sizes
              .map(
                (size, index) => `
                  <button class="variant-btn ${index === 0 ? "active" : ""}" data-modal-size="${size}">
                    ${size}
                  </button>
                `,
              )
              .join("")}
          </div>
        </div>

        <div class="variant-group">
          <label for="modal-qty">Quantity</label>
          <input id="modal-qty" class="quantity-input" type="number" min="1" max="10" value="1" />
        </div>

        <button class="modal-add-btn" id="modal-add-btn">Add To Bag</button>
      </div>
    </div>
  `;

  modal.classList.remove("hidden");
}

function closeProductModal() {
  const modal = document.getElementById("product-modal");
  if (!modal) return;
  modal.classList.add("hidden");
}

function bindShopEvents() {
  const searchInput = document.getElementById("search-input");
  const colorFilter = document.getElementById("color-filter");
  const sortFilter = document.getElementById("sort-filter");
  const filterButtons = document.querySelectorAll("#category-filters .filter-btn");
  const grid = document.getElementById("shop-grid");
  const modal = document.getElementById("product-modal");
  const closeModalButton = document.getElementById("close-modal-btn");

  if (searchInput) {
    searchInput.addEventListener("input", (event) => {
      shopState.query = event.target.value;
      renderShopGrid();
    });
  }

  if (colorFilter) {
    colorFilter.addEventListener("change", (event) => {
      shopState.color = event.target.value;
      renderShopGrid();
    });
  }

  if (sortFilter) {
    sortFilter.addEventListener("change", (event) => {
      shopState.sort = event.target.value;
      renderShopGrid();
    });
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      shopState.category = button.dataset.category;
      setActiveFilterButton(shopState.category);
      renderShopGrid();
    });
  });

  if (grid) {
    grid.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const id = target.dataset.openId;
      if (!id) return;
      openProductModal(id);
    });
  }

  if (closeModalButton) {
    closeModalButton.addEventListener("click", closeProductModal);
  }

  if (modal) {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeProductModal();
      }
    });

    modal.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;

      const color = target.dataset.modalColor;
      if (color) {
        shopState.selectedColor = color;
        const buttons = modal.querySelectorAll("[data-modal-color]");
        buttons.forEach((button) => {
          button.classList.toggle("active", button.dataset.modalColor === color);
        });
      }

      const size = target.dataset.modalSize;
      if (size) {
        shopState.selectedSize = size;
        const buttons = modal.querySelectorAll("[data-modal-size]");
        buttons.forEach((button) => {
          button.classList.toggle("active", button.dataset.modalSize === size);
        });
      }
    });

    modal.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      if (target.id !== "modal-add-btn") return;

      const product = findProductById(shopState.selectedProductId);
      const qtyInput = document.getElementById("modal-qty");
      if (!product || !qtyInput) return;

      const quantity = Math.min(10, Math.max(1, Number(qtyInput.value) || 1));
      addItemToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        color: shopState.selectedColor,
        size: shopState.selectedSize,
        quantity,
      });

      closeProductModal();
    });
  }
}

function bindHomeEvents() {
  const form = document.getElementById("newsletter-form");
  const input = document.getElementById("newsletter-input");
  const message = document.getElementById("newsletter-message");
  const addButtons = document.querySelectorAll(".add-to-cart-btn");

  addButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const id = Number(button.dataset.id);
      const name = button.dataset.name || "";
      const price = Number(button.dataset.price);
      const color = button.dataset.color || "Default";
      const size = button.dataset.size || "One Size";
      const product = findProductById(id);

      addItemToCart({
        id,
        name,
        price,
        image: product ? product.image : "",
        color,
        size,
        quantity: 1,
      });

      button.textContent = "Added";
      setTimeout(() => {
        button.textContent = "Add To Bag";
      }, 900);
    });
  });

  if (form && input && message) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!input.value.trim()) return;
      message.textContent = "Thanks. Your 10% welcome code is: AURA10";
      input.value = "";
    });
  }
}

function renderBag() {
  const list = document.getElementById("bag-list");
  const subtotalNode = document.getElementById("subtotal");
  const shippingNode = document.getElementById("shipping");
  const totalNode = document.getElementById("grand-total");
  const shippingMessageNode = document.getElementById("shipping-message");
  const shipmentStatus = document.getElementById("shipment-status");
  const checkoutPanel = document.getElementById("checkout-panel");
  const checkoutBtn = document.getElementById("checkout-btn");
  if (!list || !subtotalNode || !shippingNode || !totalNode || !shippingMessageNode) return;

  const items = getCart();
  const shipment = getShipment();

  if (!items.length) {
    list.innerHTML = "<p>Your bag is empty. Add products from the shop page.</p>";
  } else {
    list.innerHTML = items
      .map((item, index) => {
        return `
          <article class="bag-item">
            <img src="${item.image}" alt="${item.name}" />
            <div>
              <h3>${item.name}</h3>
              <p>Color: ${item.color} | Size: ${item.size}</p>
              <p>${formatPrice(item.price)} each</p>
              <div class="bag-item-controls">
                <button class="qty-btn" data-action="decrease" data-index="${index}">-</button>
                <span>${item.quantity}</span>
                <button class="qty-btn" data-action="increase" data-index="${index}">+</button>
                <button class="remove-btn" data-action="remove" data-index="${index}">Remove</button>
              </div>
            </div>
            <strong>${formatPrice(item.price * item.quantity)}</strong>
          </article>
        `;
      })
      .join("");
  }

  const subtotal = cartSubtotal(items);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 10;
  const total = subtotal + shipping;

  subtotalNode.textContent = formatPrice(subtotal);
  shippingNode.textContent = shipping === 0 ? "Free" : formatPrice(shipping);
  totalNode.textContent = formatPrice(total);

  if (subtotal >= FREE_SHIPPING_THRESHOLD) {
    shippingMessageNode.textContent = "You unlocked free shipping.";
  } else if (subtotal > 0) {
    const difference = FREE_SHIPPING_THRESHOLD - subtotal;
    shippingMessageNode.textContent = `Add ${formatPrice(difference)} more for free shipping.`;
  } else {
    shippingMessageNode.textContent = "Free shipping on orders above $120.";
  }

  if (checkoutBtn && checkoutPanel) {
    checkoutBtn.classList.toggle("hidden", !items.length);
    checkoutPanel.classList.add("hidden");
  }

  if (shipmentStatus) {
    if (!items.length && shipment) {
      shipmentStatus.classList.remove("hidden");
      shipmentStatus.innerHTML = `
        <h3>Payment Successful</h3>
        <p>Shipment ID: ${shipment.shipmentId}</p>
        <p>Expected Ship Date: ${shipment.shipDate}</p>
        <p>Expected Ship Time: ${shipment.shipTime}</p>
        <p>Payment Method: ${shipment.methodLabel}</p>
      `;
    } else {
      shipmentStatus.classList.add("hidden");
      shipmentStatus.innerHTML = "";
    }
  }
}

function bindBagEvents() {
  const list = document.getElementById("bag-list");
  const checkoutBtn = document.getElementById("checkout-btn");
  const checkoutPanel = document.getElementById("checkout-panel");
  const paymentMethod = document.getElementById("payment-method");
  const cardFields = document.getElementById("card-fields");
  const transferFields = document.getElementById("transfer-fields");
  const payNowBtn = document.getElementById("pay-now-btn");
  const checkoutFeedback = document.getElementById("checkout-feedback");
  if (!list) return;

  list.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const indexText = target.dataset.index;
    const action = target.dataset.action;
    if (!indexText || !action) return;

    const index = Number(indexText);
    const items = getCart();
    if (!items[index]) return;

    if (action === "increase") {
      items[index].quantity += 1;
    }

    if (action === "decrease") {
      items[index].quantity = Math.max(1, items[index].quantity - 1);
    }

    if (action === "remove") {
      items.splice(index, 1);
    }

    setCart(items);
    updateHeaderBag();
    renderBag();
  });

  if (checkoutBtn && checkoutPanel) {
    checkoutBtn.addEventListener("click", () => {
      const items = getCart();
      if (!items.length) return;
      checkoutPanel.classList.toggle("hidden");
    });
  }

  if (paymentMethod && cardFields && transferFields) {
    paymentMethod.addEventListener("change", () => {
      const isCard = paymentMethod.value === "card";
      cardFields.classList.toggle("hidden", !isCard);
      transferFields.classList.toggle("hidden", isCard);
    });
  }

  if (payNowBtn && paymentMethod && checkoutFeedback) {
    payNowBtn.addEventListener("click", () => {
      const items = getCart();
      if (!items.length) {
        checkoutFeedback.textContent = "Your bag is empty.";
        return;
      }

      const method = paymentMethod.value;
      if (method === "card") {
        const cardName = document.getElementById("card-name")?.value.trim() || "";
        const cardNumber = document.getElementById("card-number")?.value.replace(/\s+/g, "") || "";
        if (cardName.length < 2 || cardNumber.length < 12) {
          checkoutFeedback.textContent = "Enter valid card details to continue.";
          return;
        }
      } else {
        const bankRef = document.getElementById("bank-ref")?.value.trim() || "";
        if (bankRef.length < 6) {
          checkoutFeedback.textContent = "Enter a valid transfer reference.";
          return;
        }
      }

      checkoutFeedback.textContent = "Processing payment...";

      setTimeout(() => {
        const now = new Date();
        const shipDate = new Date(now);
        shipDate.setDate(now.getDate() + 2);

        setShipment({
          shipmentId: `AURA-SHP-${Math.floor(100000 + Math.random() * 900000)}`,
          shipDate: shipDate.toLocaleDateString(),
          shipTime: "10:00 AM - 6:00 PM",
          methodLabel: method === "card" ? "Card" : "Bank Transfer",
        });

        setCart([]);
        updateHeaderBag();
        renderBag();
      }, 900);
    });
  }
}
// DEMO CHECKOUT START
// Checkout simulation lives inside renderBag() and bindBagEvents().
// It validates payment input, clears paid cart items, and shows shipment info.
// DEMO CHECKOUT END

function initShopPage() {
  if (getPage() !== "shop") return;
  setCategoryFromUrl();
  bindShopEvents();
  renderShopGrid();
}

function initHomePage() {
  if (getPage() !== "home") return;
  bindHomeEvents();
}

function initBagPage() {
  if (getPage() !== "bag") return;
  bindBagEvents();
  renderBag();
}

// ===================== COLLECTION PAGE START =====================
function bindCollectionFilters() {
  const filterButtons = document.querySelectorAll(".collection-filter-btn");
  const cards = document.querySelectorAll(".collection-card");
  if (!filterButtons.length || !cards.length) return;

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter || "all";

      filterButtons.forEach((entry) => {
        entry.classList.toggle("active", entry === button);
      });

      cards.forEach((card) => {
        const style = card.dataset.style || "";
        const showCard = filter === "all" || style === filter;
        card.classList.toggle("hidden-card", !showCard);
      });
    });
  });
}

function bindCollectionPreview() {
  const grid = document.getElementById("collection-grid");
  const modal = document.getElementById("collection-preview-modal");
  const body = document.getElementById("collection-preview-body");
  const closeButton = document.getElementById("close-collection-modal");
  if (!grid || !modal || !body || !closeButton) return;

  grid.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const previewButton = target.closest(".preview-look-btn");
    if (previewButton instanceof HTMLElement) {
      const title = previewButton.dataset.title || "Collection Look";
      const image = previewButton.dataset.image || "";
      const copy = previewButton.dataset.copy || "";

      body.innerHTML = `
        <div class="collection-preview-layout">
          <img src="${image}" alt="${title}" />
          <div>
            <p class="collection-overline">Collection Preview</p>
            <h3>${title}</h3>
            <p>${copy}</p>
            <a href="shop.html" class="cta-btn">Shop This Look</a>
          </div>
        </div>
      `;

      modal.classList.remove("hidden");
      return;
    }

    const saveButton = target.closest(".save-look-btn");
    if (saveButton instanceof HTMLElement) {
      saveButton.classList.toggle("saved");
      saveButton.textContent = saveButton.classList.contains("saved")
        ? "Saved"
        : "Save Look";

      const countNode = document.getElementById("saved-looks-count");
      if (!countNode) return;
      const savedCount = document.querySelectorAll(".save-look-btn.saved").length;
      countNode.textContent = String(savedCount);
    }
  });

  closeButton.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.classList.add("hidden");
    }
  });
}

function bindCollectionBuilder() {
  const button = document.getElementById("recommend-look-btn");
  const occasionSelect = document.getElementById("occasion-select");
  const paletteSelect = document.getElementById("palette-select");
  const result = document.getElementById("recommend-look-result");
  if (!button || !occasionSelect || !paletteSelect || !result) return;

  const recommendations = {
    work: {
      neutral: "Try Power Tailoring Capsule in sand and slate for office-ready polish.",
      dark: "Try Minimal Office Capsule in black and navy for a sharp professional look.",
      warm: "Try Power Tailoring Capsule with warm camel accents for a premium tone.",
    },
    weekend: {
      neutral: "Try Relaxed Linen Capsule in ivory and sand for daytime ease.",
      dark: "Try Street Utility Capsule in black and olive for modern edge.",
      warm: "Try Relaxed Linen Capsule with soft tan accessories for a warm casual fit.",
    },
    evening: {
      neutral: "Try Night City Capsule with ivory details for elevated contrast.",
      dark: "Try Night City Capsule in all-black layers for evening confidence.",
      warm: "Try Soft Luxe Accessories Capsule with gold accents for dinner events.",
    },
  };

  button.addEventListener("click", () => {
    const occasion = occasionSelect.value;
    const palette = paletteSelect.value;
    const message = recommendations[occasion]?.[palette];
    result.innerHTML = `${message || "Try our latest capsule edits."} <a href="shop.html">Shop now</a>`;
  });
}

function initCollectionPage() {
  if (getPage() !== "collection") return;
  bindCollectionFilters();
  bindCollectionPreview();
  bindCollectionBuilder();
}
// ===================== COLLECTION PAGE END =====================

// ===================== CONTACT PAGE START =====================
function clearContactErrors() {
  const errorIds = [
    "error-name",
    "error-email",
    "error-phone",
    "error-topic",
    "error-message",
  ];

  errorIds.forEach((id) => {
    const node = document.getElementById(id);
    if (node) node.textContent = "";
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  if (!phone.trim()) return true;
  return /^[0-9+\-\s()]{7,20}$/.test(phone);
}

function bindContactForm() {
  const form = document.getElementById("contact-form");
  const success = document.getElementById("contact-form-success");
  if (!form || !success) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearContactErrors();
    success.textContent = "";

    const name = document.getElementById("contact-name")?.value.trim() || "";
    const email = document.getElementById("contact-email")?.value.trim() || "";
    const phone = document.getElementById("contact-phone")?.value.trim() || "";
    const topic = document.getElementById("contact-topic")?.value.trim() || "";
    const message = document.getElementById("contact-message")?.value.trim() || "";

    let hasError = false;

    if (name.length < 2) {
      const node = document.getElementById("error-name");
      if (node) node.textContent = "Please enter your full name.";
      hasError = true;
    }

    if (!isValidEmail(email)) {
      const node = document.getElementById("error-email");
      if (node) node.textContent = "Please enter a valid email address.";
      hasError = true;
    }

    if (!isValidPhone(phone)) {
      const node = document.getElementById("error-phone");
      if (node) node.textContent = "Please enter a valid phone number.";
      hasError = true;
    }

    if (!topic) {
      const node = document.getElementById("error-topic");
      if (node) node.textContent = "Please select a topic.";
      hasError = true;
    }

    if (message.length < 15) {
      const node = document.getElementById("error-message");
      if (node) node.textContent = "Message should be at least 15 characters.";
      hasError = true;
    }

    if (hasError) return;

    success.textContent = "Message received. Our team will respond within 24 hours.";
    form.reset();
  });
}

function bindOrderLookup() {
  const button = document.getElementById("lookup-btn");
  const orderNode = document.getElementById("lookup-order");
  const emailNode = document.getElementById("lookup-email");
  const resultNode = document.getElementById("lookup-result");
  if (!button || !orderNode || !emailNode || !resultNode) return;

  button.addEventListener("click", () => {
    const order = orderNode.value.trim().toUpperCase();
    const email = emailNode.value.trim();

    if (!order || !email) {
      resultNode.textContent = "Enter your order number and email to continue.";
      return;
    }

    if (!isValidEmail(email)) {
      resultNode.textContent = "Please use a valid email address.";
      return;
    }

    const looksValid = /^AURA-\d{3,6}$/.test(order);
    if (!looksValid) {
      resultNode.textContent = "Order format should look like AURA-1024.";
      return;
    }

    resultNode.textContent = "Order found: Processing at warehouse. Estimated delivery in 2-4 business days.";
  });
}

function bindContactFaq() {
  const faqList = document.getElementById("faq-list");
  if (!faqList) return;

  faqList.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const question = target.closest(".faq-question");
    if (!(question instanceof HTMLElement)) return;

    const item = question.closest(".faq-item");
    if (!(item instanceof HTMLElement)) return;

    // FAQ ACCORDION START: keep only one slide open at a time
    const allItems = faqList.querySelectorAll(".faq-item");
    allItems.forEach((entry) => {
      if (entry !== item) {
        entry.classList.remove("open");
      }
    });

    item.classList.toggle("open");
    // FAQ ACCORDION END
  });
}

function initContactPage() {
  if (getPage() !== "contact") return;
  bindContactForm();
  bindOrderLookup();
  bindContactFaq();
}
// ===================== CONTACT PAGE END =====================

document.addEventListener("DOMContentLoaded", () => {
  initPagePreloader();
  initMobileMenu();
  updateHeaderBag();
  initHomePage();
  initShopPage();
  initBagPage();
  initCollectionPage();
  initContactPage();
});
