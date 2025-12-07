// cart.js - simple cart helpers used by cart and checkout pages

function getCart(){
  return JSON.parse(localStorage.getItem('cart')||'[]');
}
function saveCart(cart){ localStorage.setItem('cart', JSON.stringify(cart)); }

function renderCartPage(){
  const container = document.getElementById('cart-contents');
  const cart = getCart();
  if(!container) return;
  if(cart.length===0){
    container.innerHTML = '<p>Your cart is empty.</p>';
    document.getElementById('cart-actions').innerHTML = '';
    return;
  }
  // Use global products array to build rows
  const html = cart.map(item=>{
    const p = products.find(x=>x.id===item.id);
    if(!p) return '';
    return `
      <div class="cart-item" data-id="${p.id}">
        <img src="${p.image}" alt="${p.name}">
        <div style="flex:1">
          <h4>${p.name}</h4>
          <p>Price: ${p.price}</p>
          <p>Stock: ${p.stock}</p>
        </div>
        <div>
          <label>Qty</label>
          <input type="number" class="cart-qty" min="1" max="${p.stock}" value="${item.qty}" data-id="${p.id}">
          <button class="remove-item" data-id="${p.id}">Remove</button>
        </div>
      </div>
    `;
  }).join('');
  container.innerHTML = html;

  // actions
  document.getElementById('cart-actions').innerHTML = `
    <div class="cart-summary">
      <button id="clear-cart">Clear Cart</button>
      <a href="checkout.html" class="btn">Proceed to Checkout</a>
    </div>
  `;

  // wire actions
  document.querySelectorAll('.cart-qty').forEach(inp=>{
    inp.addEventListener('change', e=>{
      const id = Number(inp.dataset.id);
      let qty = Number(inp.value) || 1;
      const product = products.find(p=>p.id===id);
      if(product) qty = Math.max(1, Math.min(product.stock, qty));
      const cart = getCart();
      const found = cart.find(i=>i.id===id);
      if(found) found.qty = qty;
      saveCart(cart);
      renderCartPage();
    });
  });

  document.querySelectorAll('.remove-item').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const id = Number(btn.dataset.id);
      let cart = getCart();
      cart = cart.filter(i=>i.id!==id);
      saveCart(cart);
      renderCartPage();
    });
  });

  document.getElementById('clear-cart').addEventListener('click', ()=>{
    if(confirm('Clear cart?')){
      localStorage.removeItem('cart');
      renderCartPage();
    }
  });
}

// If cart.html is loaded, render
if(document.getElementById('cart-contents')) renderCartPage();
