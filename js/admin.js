// admin.js - simple client-side admin dashboard

const ADMIN_USER = 'admin';
const ADMIN_PASS = 'password123'; // demo only — insecure

function $(id){ return document.getElementById(id); }

function showView(name){
  document.querySelectorAll('.admin-view').forEach(v=>v.classList.add('hidden'));
  const el = document.getElementById(name);
  if(el) el.classList.remove('hidden');
}

function renderOverview(){
  const orders = JSON.parse(localStorage.getItem('orders')||'[]');
  const messages = JSON.parse(localStorage.getItem('ai_messages')||'[]');
  const productsCount = (window.products||[]).length;
  document.getElementById('overview').innerHTML = `
    <div>
      <h3>Overview</h3>
      <p>Products: <strong>${productsCount}</strong></p>
      <p>Orders: <strong>${orders.length}</strong></p>
      <p>Messages: <strong>${messages.length}</strong></p>
    </div>
  `;
}

function renderProductsAdmin(){
  const el = document.getElementById('products');
  const list = (window.products||[]).map(p=>`
    <div style="border-bottom:1px solid #eee;padding:8px 0">
      <strong>${p.name}</strong> — ${p.category} — ${p.price} — stock: ${p.stock}
    </div>
  `).join('');
  el.innerHTML = `<h3>Products</h3>${list}`;
}

function renderOrders(){
  const el = document.getElementById('orders');
  const orders = JSON.parse(localStorage.getItem('orders')||'[]').slice().reverse();
  if(orders.length===0){ el.innerHTML = '<p>No orders yet.</p>'; return; }
  el.innerHTML = orders.map(o=>`
    <div style="border-bottom:1px solid #ddd;padding:10px 0">
      <strong>Order ${o.id}</strong> — ${new Date(o.createdAt).toLocaleString()} — ${o.name || ''} <br/>
      Items: ${o.items.map(i=>{ const p=products.find(x=>x.id===i.id); return (p?p.name:'?') + ' x'+i.qty; }).join(', ')}
    </div>
  `).join('');
}

function renderMessages(){
  const el = document.getElementById('messages');
  const messages = JSON.parse(localStorage.getItem('ai_messages')||'[]').slice().reverse();
  if(messages.length===0){ el.innerHTML = '<p>No messages yet.</p>'; return; }
  el.innerHTML = messages.map(m=>`
    <div style="border-bottom:1px solid #ddd;padding:10px 0">
      <strong>${m.question}</strong><br/>
      <em>${m.answer || '—'}</em><br/>
      ${new Date(m.createdAt).toLocaleString()}
    </div>
  `).join('');
}

// login
const loginBtn = document.getElementById('admin-login-btn');
if(loginBtn){
  loginBtn.addEventListener('click', ()=>{
    const u = document.getElementById('admin-user').value;
    const p = document.getElementById('admin-pass').value;
    if(u===ADMIN_USER && p===ADMIN_PASS){
      document.getElementById('admin-login').classList.add('hidden');
      document.getElementById('admin-dashboard').classList.remove('hidden');
      renderOverview(); renderProductsAdmin(); renderOrders(); renderMessages();
    } else alert('Invalid credentials (demo)');
  });
}

// sidebar triggers
document.querySelectorAll('.admin-nav a').forEach(a=>{
  a.addEventListener('click', (e)=>{
    e.preventDefault();
    const view = a.dataset.view;
    if(!view) return;
    showView(view);
    if(view==='overview') renderOverview();
    if(view==='products') renderProductsAdmin();
    if(view==='orders') renderOrders();
    if(view==='messages') renderMessages();
  });
});

// logout
const logout = document.getElementById('admin-logout');
if(logout) logout.addEventListener('click', ()=>{
  location.href = location.pathname; // reload
});
