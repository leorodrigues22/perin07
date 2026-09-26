// ================================
// CONFIGURAÇÃO PRINCIPAL
// Troque pelo número real da loja.
// Formato: código do país + DDD + número, sem espaços.
// Exemplo Chapecó: 5549999999999
// ================================
const WHATSAPP_NUMBER = "5549999999999";

const products = [
  {
    id: 1,
    name: "Perin Basic Preta",
    price: 79.90,
    description: "Camiseta básica preta, modelagem confortável e visual minimalista.",
    badge: "ESSENCIAL",
    image: "images/camisa-preta.svg"
  },
  {
    id: 2,
    name: "Perin Oversized Off White",
    price: 89.90,
    description: "Modelagem oversized com caimento amplo e estética streetwear.",
    badge: "NOVIDADE",
    image: "images/camisa-offwhite.svg"
  },
  {
    id: 3,
    name: "Perin Graphic Cinza",
    price: 94.90,
    description: "Camiseta cinza com estampa frontal inspirada na identidade da marca.",
    badge: "DROP 01",
    image: "images/camisa-cinza.svg"
  },
  {
    id: 4,
    name: "Perin Essential Branca",
    price: 79.90,
    description: "Branca clássica com acabamento limpo para combinar com tudo.",
    badge: "CLÁSSICA",
    image: "images/camisa-branca.svg"
  },
  {
    id: 5,
    name: "Perin Black Logo",
    price: 99.90,
    description: "Preta com assinatura visual Perin em destaque.",
    badge: "DESTAQUE",
    image: "images/camisa-logo.svg"
  },
  {
    id: 6,
    name: "Perin Sand Oversized",
    price: 94.90,
    description: "Tom areia, modelagem ampla e composição neutra para looks urbanos.",
    badge: "LIMITADA",
    image: "images/camisa-areia.svg"
  }
];

let cart = [];

const productsGrid = document.querySelector("#productsGrid");
const cartDrawer = document.querySelector("#cartDrawer");
const overlay = document.querySelector("#overlay");
const cartItems = document.querySelector("#cartItems");
const cartCount = document.querySelector("#cartCount");
const cartTotal = document.querySelector("#cartTotal");
const toast = document.querySelector("#toast");

function formatPrice(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function renderProducts() {
  productsGrid.innerHTML = products.map(product => `
    <article class="product-card">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}">
        <span class="product-badge">${product.badge}</span>
      </div>

      <div class="product-info">
        <div class="product-topline">
          <h3 class="product-name">${product.name}</h3>
          <span class="product-price">${formatPrice(product.price)}</span>
        </div>

        <p class="product-description">${product.description}</p>

        <div class="product-controls">
          <select class="size-select" id="size-${product.id}" aria-label="Escolha o tamanho de ${product.name}">
            <option value="">Tamanho</option>
            <option value="P">P</option>
            <option value="M">M</option>
            <option value="G">G</option>
            <option value="GG">GG</option>
          </select>
          <button class="add-button" onclick="addToCart(${product.id})">Adicionar</button>
        </div>
      </div>
    </article>
  `).join("");
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  const sizeSelect = document.querySelector(`#size-${productId}`);
  const size = sizeSelect.value;

  if (!size) {
    showToast("Escolha um tamanho primeiro.");
    sizeSelect.focus();
    return;
  }

  const existingItem = cart.find(item => item.id === productId && item.size === size);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, size, quantity: 1 });
  }

  sizeSelect.value = "";
  updateCart();
  showToast("Produto adicionado ao carrinho.");
}

function updateCart() {
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = itemCount;

  if (cart.length === 0) {
    cartItems.innerHTML = `<p class="empty-cart">Seu carrinho está vazio.</p>`;
  } else {
    cartItems.innerHTML = cart.map((item, index) => `
      <div class="cart-item">
        <img class="cart-thumb" src="${item.image}" alt="${item.name}">
        <div>
          <h3>${item.name}</h3>
          <p>Tamanho ${item.size} • Qtd. ${item.quantity}</p>
          <p>${formatPrice(item.price * item.quantity)}</p>
        </div>
        <button class="remove-item" onclick="removeFromCart(${index})">Remover</button>
      </div>
    `).join("");
  }

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  cartTotal.textContent = formatPrice(total);
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

function openCart() {
  cartDrawer.classList.add("open");
  overlay.classList.add("active");
  cartDrawer.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  cartDrawer.classList.remove("open");
  overlay.classList.remove("active");
  cartDrawer.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function finishOrder() {
  if (cart.length === 0) {
    showToast("Adicione pelo menos uma peça ao carrinho.");
    return;
  }

  const lines = cart.map(item =>
    `• ${item.quantity}x ${item.name} | Tamanho: ${item.size} | ${formatPrice(item.price * item.quantity)}`
  );

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const message = [
    "Olá! Gostaria de fazer este pedido na Perin:",
    "",
    ...lines,
    "",
    `Total: ${formatPrice(total)}`,
    "",
    "Pode me confirmar a disponibilidade, por favor?"
  ].join("\n");

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

function openDirectWhatsapp() {
  const message = "Olá! Vim pelo site da Perin e gostaria de falar sobre as camisetas disponíveis.";
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

document.querySelector("#openCart").addEventListener("click", openCart);
document.querySelector("#closeCart").addEventListener("click", closeCart);
document.querySelector("#overlay").addEventListener("click", closeCart);
document.querySelector("#finishWhatsapp").addEventListener("click", finishOrder);
document.querySelector("#directWhatsapp").addEventListener("click", openDirectWhatsapp);

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeCart();
});

document.querySelector("#year").textContent = new Date().getFullYear();

renderProducts();
updateCart();
