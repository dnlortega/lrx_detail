/**
 * LRX DETAIL - Lógica Interativa
 * - Carrinho de Produtos com Valores
 * - Calculadora Dinâmica de Orçamento por Porte de Veículo (Carros do dia a dia)
 * - Integração direta com WhatsApp
 * - Filtros de Catálogo & FAQ
 */

// Catálogo de Produtos e Valores Oficiais
const PRODUCTS_DATA = [
  {
    id: 'prod-1',
    name: 'Shampoo Neutro Snow Foam LRX Pro',
    category: 'wash',
    categoryName: 'Lavagem Técnica',
    price: 49.90,
    oldPrice: 59.90,
    volume: '1000ml (Rende até 20 lavagens)',
    badge: 'Mais Vendido',
    image: 'assets/products.jpg',
    description: 'Fórmula ultra concentrada com pH neutro. Cria uma espuma espessa que amolece a sujeira sem arranhar a lataria e sem remover ceras existentes.'
  },
  {
    id: 'prod-2',
    name: 'Cera Líquida de SiO2 & Carnaúba',
    category: 'protect',
    categoryName: 'Brilho & Proteção',
    price: 68.90,
    oldPrice: 82.00,
    volume: '500ml com Borrifador Gatilho',
    badge: 'Alta Repelência',
    image: 'assets/products.jpg',
    description: 'Proporciona toque aveludado, brilho espelhado instantâneo e repelência hidrofóbica com durabilidade de até 4 meses contra chuva ácida e sol.'
  },
  {
    id: 'prod-3',
    name: 'Pretinho Acetinado Hidrofóbico Tire Black',
    category: 'wheels',
    categoryName: 'Pneus & Rodas',
    price: 38.90,
    oldPrice: 45.00,
    volume: '500ml',
    badge: 'Não Gruda Poeira',
    image: 'assets/products.jpg',
    description: 'Acabamento preto profundo acetinado de longa duração. Resiste a poças d\'água, chuva e não atrai poeira nem respinga na lataria.'
  },
  {
    id: 'prod-4',
    name: 'Limpador Multiuso APC Interiores LRX',
    category: 'interior',
    categoryName: 'Cuidados Internos',
    price: 44.90,
    oldPrice: 52.00,
    volume: '500ml',
    badge: 'Toque Seco',
    image: 'assets/products.jpg',
    description: 'Higienizador para plásticos, painéis, portas e estofados. Remove gordura, marcas de dedos e odores deixando aroma suave e proteção UV.'
  },
  {
    id: 'prod-5',
    name: 'Selante Cerâmico Cristalizador Spray',
    category: 'protect',
    categoryName: 'Proteção Cerâmica',
    price: 94.90,
    oldPrice: 119.90,
    volume: '500ml',
    badge: 'Proteção 6 Meses',
    image: 'assets/products.jpg',
    description: 'Nanotecnologia cerâmica para o carro do dia a dia. Cria uma blindagem protetora contra dejetos de pássaros, raios solares e maresia.'
  },
  {
    id: 'prod-6',
    name: 'Kit Completo Cuidados em Casa LRX',
    category: 'kits',
    categoryName: 'Kits Promocionais',
    price: 189.90,
    oldPrice: 245.00,
    volume: 'Kit 6 Peças',
    badge: 'Melhor Custo-Benefício',
    image: 'assets/products.jpg',
    description: 'Inclui: 1 Shampoo Neutro 1L + 1 Cera SiO2 500ml + 1 Pretinho 500ml + 1 Luva de Microfibra + 2 Toalhas de Microfibra 400GSM.'
  }
];

// Tabela de Preços de Serviços para Veículos Convencionais do Dia a Dia
const SERVICES_DATA = {
  hatch: {
    name: 'Hatch / Compacto',
    description: 'Ex: Polo, Onix, HB20, Gol, Argo, Ka, Yaris',
    services: {
      lavagemDetalhada: 89.90,
      lavagemMotor: 110.00,
      higienizacaoInterna: 210.00,
      revitalizacaoFarois: 139.90,
      polimentoComercial: 370.00,
      vitrificacaoPintura: 690.00
    }
  },
  sedan: {
    name: 'Sedan / Perua',
    description: 'Ex: Corolla, Civic, Virtus, Cronos, Prisma, Voyage',
    services: {
      lavagemDetalhada: 109.90,
      lavagemMotor: 120.00,
      higienizacaoInterna: 240.00,
      revitalizacaoFarois: 139.90,
      polimentoComercial: 440.00,
      vitrificacaoPintura: 790.00
    }
  },
  suv: {
    name: 'SUV Compacto / Médio',
    description: 'Ex: T-Cross, Tracker, Kicks, Creta, Renegade, Compass',
    services: {
      lavagemDetalhada: 129.90,
      lavagemMotor: 130.00,
      higienizacaoInterna: 270.00,
      revitalizacaoFarois: 139.90,
      polimentoComercial: 490.00,
      vitrificacaoPintura: 890.00
    }
  },
  pickup: {
    name: 'Picape / SUV Grande',
    description: 'Ex: Strada, Saveiro, Toro, Hilux, S10, SW4',
    services: {
      lavagemDetalhada: 149.90,
      lavagemMotor: 140.00,
      higienizacaoInterna: 310.00,
      revitalizacaoFarois: 139.90,
      polimentoComercial: 580.00,
      vitrificacaoPintura: 990.00
    }
  }
};

// Número de WhatsApp da Loja / Oficina
const WHATSAPP_NUMBER = '5514991045318';

// Estado do Carrinho de Compras
let cart = [];

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  renderProducts('all');
  initProductFilters();
  initCalculator();
  initCartModal();
  initFAQ();
  initMobileMenu();
  loadCartFromStorage();
});

// Renderização dos Produtos
function renderProducts(filter) {
  const container = document.getElementById('products-grid');
  if (!container) return;

  const filtered = filter === 'all' 
    ? PRODUCTS_DATA 
    : PRODUCTS_DATA.filter(p => p.category === filter);

  container.innerHTML = filtered.map(product => `
    <article class="product-card ${product.badge === 'Melhor Custo-Benefício' || product.badge === 'Mais Vendido' ? 'shine-effect' : ''}" data-id="${product.id}">
      <span class="product-badge-flag">${product.badge}</span>
      <div class="product-img-box">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
      </div>
      <div class="product-cat">${product.categoryName}</div>
      <h3 class="product-title">${product.name}</h3>
      <p class="product-desc">${product.description}</p>
      <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px;">
        <span class="product-volume-tag">${product.volume}</span>
        ${product.category === 'protect' || product.category === 'wash' ? '<span class="water-droplet-badge">💧 Hidrorrepelente</span>' : ''}
      </div>
      
      <div class="product-pricing-row">
        <div class="price-box">
          <span class="price-label">Preço Especial</span>
          <div class="price-val"><span>R$</span> ${product.price.toFixed(2).replace('.', ',')}</div>
        </div>
        ${product.oldPrice ? `<span class="old-price">R$ ${product.oldPrice.toFixed(2).replace('.', ',')}</span>` : ''}
      </div>

      <div class="product-actions">
        <button class="btn-add-cart" onclick="addToCart('${product.id}')" title="Adicionar ao pedido">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
          Adicionar
        </button>
        <button class="btn-buy-now" onclick="buyNow('${product.id}')" title="Comprar direto via WhatsApp">
          Pedir Já
        </button>
      </div>
    </article>
  `).join('');
}

// Filtros de Categoria
function initProductFilters() {
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      renderProducts(filter);
    });
  });
}

// ==========================================================================
// CALCULADORA DE ORÇAMENTO INTERATIVO
// ==========================================================================
function initCalculator() {
  const vehicleRadios = document.querySelectorAll('input[name="vehicle-type"]');
  const serviceCheckboxes = document.querySelectorAll('.service-calc-check');

  function updatePricesAndTotal() {
    const selectedVehicle = document.querySelector('input[name="vehicle-type"]:checked').value;
    const vehicleData = SERVICES_DATA[selectedVehicle];

    // Atualiza os preços mostrados ao lado de cada checkbox
    serviceCheckboxes.forEach(checkbox => {
      const serviceKey = checkbox.getAttribute('data-service');
      const price = vehicleData.services[serviceKey];
      const priceElement = document.getElementById(`price-${serviceKey}`);
      if (priceElement) {
        priceElement.textContent = `R$ ${price.toFixed(2).replace('.', ',')}`;
      }
    });

    // Calcula total selecionado
    let total = 0;
    serviceCheckboxes.forEach(checkbox => {
      if (checkbox.checked) {
        const serviceKey = checkbox.getAttribute('data-service');
        total += vehicleData.services[serviceKey];
      }
    });

    const totalEl = document.getElementById('calc-total-val');
    if (totalEl) {
      totalEl.innerHTML = `<span>R$</span> ${total.toFixed(2).replace('.', ',')}`;
    }
  }

  vehicleRadios.forEach(radio => radio.addEventListener('change', updatePricesAndTotal));
  serviceCheckboxes.forEach(check => check.addEventListener('change', updatePricesAndTotal));

  // Inicializa com os valores padrão
  updatePricesAndTotal();

  // Botão de Enviar Orçamento da Calculadora via WhatsApp
  const btnSendCalc = document.getElementById('btn-send-calc-whatsapp');
  if (btnSendCalc) {
    btnSendCalc.addEventListener('click', () => {
      const selectedVehicle = document.querySelector('input[name="vehicle-type"]:checked').value;
      const vehicleData = SERVICES_DATA[selectedVehicle];
      
      const selectedServices = [];
      let total = 0;

      serviceCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
          const serviceKey = checkbox.getAttribute('data-service');
          const serviceName = checkbox.closest('.check-item').querySelector('.check-text-title').textContent.trim();
          const price = vehicleData.services[serviceKey];
          selectedServices.push(`- ${serviceName}: R$ ${price.toFixed(2).replace('.', ',')}`);
          total += price;
        }
      });

      if (selectedServices.length === 0) {
        showToast('Por favor, selecione ao menos um serviço para orçar!');
        return;
      }

      let msg = `Olá, equipe da *LRX DETAIL*! Gostaria de agendar um atendimento para o meu veículo:\n\n`;
      msg += `🚗 *Tipo de Carro:* ${vehicleData.name} (${vehicleData.description})\n`;
      msg += `📋 *Serviços Selecionados:*\n${selectedServices.join('\n')}\n\n`;
      msg += `💰 *Valor Estimado:* R$ ${total.toFixed(2).replace('.', ',')}\n\n`;
      msg += `Poderiam me informar os horários e datas disponíveis?`;

      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
      window.open(url, '_blank');
    });
  }
}

// ==========================================================================
// CARRINHO DE COMPRAS E VALORES
// ==========================================================================
function addToCart(productId) {
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  saveCart();
  updateCartUI();
  showToast(`"${product.name}" adicionado ao seu pedido!`);
}

function buyNow(productId) {
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;

  let msg = `Olá, equipe da *LRX DETAIL*! Gostaria de pedir o seguinte produto:\n\n`;
  msg += `📦 *Produto:* ${product.name}\n`;
  msg += `💰 *Valor:* R$ ${product.price.toFixed(2).replace('.', ',')}\n`;
  msg += `🧴 *Conteúdo:* ${product.volume}\n\n`;
  msg += `Como posso proceder com o pagamento e retirada/envio?`;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

function updateCartQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== productId);
  }

  saveCart();
  updateCartUI();
  renderCartModal();
}

function removeCartItem(productId) {
  cart = cart.filter(i => i.id !== productId);
  saveCart();
  updateCartUI();
  renderCartModal();
}

function saveCart() {
  try {
    localStorage.setItem('lrx_detail_cart', JSON.stringify(cart));
  } catch (e) {
    console.error(e);
  }
}

function loadCartFromStorage() {
  try {
    const saved = localStorage.getItem('lrx_detail_cart');
    if (saved) {
      cart = JSON.parse(saved);
      updateCartUI();
    }
  } catch (e) {
    console.error(e);
  }
}

function updateCartUI() {
  const totalCount = cart.reduce((acc, item) => acc + item.qty, 0);
  const badge = document.getElementById('cart-badge-count');
  if (badge) {
    badge.textContent = totalCount;
  }
}

// Modal do Carrinho
function initCartModal() {
  const cartBtn = document.getElementById('open-cart-btn');
  const modalOverlay = document.getElementById('cart-modal-overlay');
  const closeBtn = document.getElementById('close-cart-btn');
  const btnCheckout = document.getElementById('btn-checkout-cart');

  if (cartBtn && modalOverlay) {
    cartBtn.addEventListener('click', () => {
      renderCartModal();
      modalOverlay.classList.add('open');
    });
  }

  if (closeBtn && modalOverlay) {
    closeBtn.addEventListener('click', () => {
      modalOverlay.classList.remove('open');
    });
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('open');
      }
    });
  }

  if (btnCheckout) {
    btnCheckout.addEventListener('click', () => {
      if (cart.length === 0) {
        showToast('Seu carrinho está vazio!');
        return;
      }

      let total = 0;
      const itemsText = cart.map(item => {
        const sub = item.price * item.qty;
        total += sub;
        return `• ${item.qty}x ${item.name} (R$ ${item.price.toFixed(2).replace('.', ',')} un) = R$ ${sub.toFixed(2).replace('.', ',')}`;
      });

      let msg = `Olá, equipe da *LRX DETAIL*! Quero fazer o pedido dos seguintes produtos do site:\n\n`;
      msg += `🛒 *Itens do Pedido:*\n${itemsText.join('\n')}\n\n`;
      msg += `💵 *Total do Pedido:* R$ ${total.toFixed(2).replace('.', ',')}\n\n`;
      msg += `Gostaria de combinar a entrega ou retirada e a forma de pagamento!`;

      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
      window.open(url, '_blank');
    });
  }
}

function renderCartModal() {
  const container = document.getElementById('cart-items-container');
  const totalEl = document.getElementById('cart-subtotal-val');
  if (!container || !totalEl) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty-message">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin: 0 auto 12px; color: var(--text-muted);"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
        <p>Seu carrinho de produtos está vazio.</p>
        <p style="font-size: 0.82rem; margin-top: 6px;">Escolha um dos nossos produtos automotivos de alta performance para manter seu carro sempre novo.</p>
      </div>
    `;
    totalEl.textContent = 'R$ 0,00';
    return;
  }

  let total = 0;
  container.innerHTML = `
    <ul class="cart-items-list">
      ${cart.map(item => {
        const sub = item.price * item.qty;
        total += sub;
        return `
          <li class="cart-item-row">
            <div class="cart-item-info">
              <div class="cart-item-title">${item.name}</div>
              <div class="cart-item-price">R$ ${item.price.toFixed(2).replace('.', ',')} un</div>
            </div>
            <div class="cart-item-controls">
              <button class="qty-btn" onclick="updateCartQty('${item.id}', -1)" title="Diminuir">-</button>
              <span class="qty-val">${item.qty}</span>
              <button class="qty-btn" onclick="updateCartQty('${item.id}', 1)" title="Aumentar">+</button>
              <button class="btn-remove-item" onclick="removeCartItem('${item.id}')" title="Remover item">×</button>
            </div>
          </li>
        `;
      }).join('')}
    </ul>
  `;

  totalEl.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

// ==========================================================================
// FAQ ACORDEÃO
// ==========================================================================
function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      items.forEach(i => i.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

// ==========================================================================
// MENU MOBILE RESPONSIVO
// ==========================================================================
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-toggle-btn');
  const navLinks = document.getElementById('nav-links');

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }
}

// ==========================================================================
// TOAST NOTIFICAÇÃO
// ==========================================================================
function showToast(message) {
  let toast = document.getElementById('app-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'app-toast';
    toast.className = 'toast-msg';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff2638" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
    <span>${message}</span>
  `;

  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}
