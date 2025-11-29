// inventory-website/js/main.js

// Helper: Get URL query parameter
function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

// Load products for homepage or category
function loadProducts() {
  const category = getQueryParam("category");
  const container = document.getElementById("product-list") || document.getElementById("featured-products");
  const titleEl = document.getElementById("category-title");

  let filtered = products;
  if (category) {
    filtered = products.filter(p => p.category === category);
    if (titleEl) titleEl.textContent = category.charAt(0).toUpperCase() + category.slice(1);
  } else {
    filtered = products.slice(0, 4); // show first 4 as featured
  }

  if (!container) return;

  container.innerHTML = filtered.map(p => `
    <div class="product-card">
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>

      <!-- Color dots -->
      <div class="color-options">
        ${(p.colors || []).map(c => `
          <span class="color-dot" style="background:${c}"></span>
        `).join('')}
      </div>

      <p class="price">Price: ${p.price}</p>
      <p>${p.stock > 0 ? "In Stock" : "Out of Stock"}</p>
    </div>
  `).join('');
}

// Search filter
const searchInput = document.getElementById("search");
if (searchInput) {
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(query));
    const container = document.getElementById("product-list");
    container.innerHTML = filtered.map(p => `
      <div class="product-card">
        <img src="${p.image}" alt="${p.name}">
        <h3>${p.name}</h3>

        <!-- Color dots (search results too!) -->
        <div class="color-options">
          ${(p.colors || []).map(c => `
            <span class="color-dot" style="background:${c}"></span>
          `).join('')}
        </div>

        <p class="price">Price: ${p.price}</p>
        <p>${p.stock > 0 ? "In Stock" : "Out of Stock"}</p>
      </div>
    `).join('');
  });
}

// Initialize
window.addEventListener("DOMContentLoaded", loadProducts);
