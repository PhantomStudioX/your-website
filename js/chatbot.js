// chatbot.js - simple front-end chat widget + store messages to localStorage

(function(){
  // create widget
  const widget = document.createElement('div');
  widget.id = 'chat-widget';
  widget.innerHTML = `
    <button id="chat-toggle" aria-label="Open chat">Chat</button>
    <div id="chat-panel" class="hidden">
      <div id="chat-messages" class="chat-messages"></div>
      <div class="chat-controls">
        <input id="chat-input" placeholder="Ask about shipping, stock, returns..." />
        <button id="chat-send">Send</button>
      </div>
    </div>
  `;
  document.body.appendChild(widget);

  // basic styles (injected)
  const css = document.createElement('style');
  css.textContent = `
    #chat-widget{ position:fixed; right:18px; bottom:18px; z-index:9999; font-family:Arial;}
    #chat-toggle{ background:#1b5e20;color:#fff;padding:10px;border-radius:8px;border:none;cursor:pointer;}
    #chat-panel{ width:320px; max-width:90vw; height:420px; background:#fff;border-radius:8px; box-shadow:0 8px 30px rgba(0,0,0,.15); overflow:hidden; display:flex; flex-direction:column;}
    #chat-panel.hidden{ display:none; }
    .chat-messages{ flex:1; padding:10px; overflow:auto; }
    .chat-controls{ display:flex; gap:8px; padding:10px; border-top:1px solid #eee; }
    #chat-input{ flex:1; padding:8px; border:1px solid #ddd; border-radius:6px; }
    .msg { margin-bottom:8px; }
    .msg.question{ text-align:right; font-weight:bold; }
    .msg.answer{ text-align:left; color:#333; }
  `;
  document.head.appendChild(css);

  const toggle = widget.querySelector('#chat-toggle');
  const panel = widget.querySelector('#chat-panel');
  const messagesEl = widget.querySelector('#chat-messages');
  const input = widget.querySelector('#chat-input');
  const sendBtn = widget.querySelector('#chat-send');

  toggle.addEventListener('click', ()=> panel.classList.toggle('hidden'));

  function loadMessages(){
    const arr = JSON.parse(localStorage.getItem('ai_messages')||'[]');
    messagesEl.innerHTML = arr.map(m=>`
      <div class="msg question">${m.question}</div>
      <div class="msg answer">${m.answer || ''}</div>
    `).join('');
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }
  loadMessages();

  function simulatedAI(question){
    // simple canned responses
    const q = question.toLowerCase();
    if(q.includes('shipping')) return 'Shipping is 3-7 business days locally. Free over $100.';
    if(q.includes('stock')) return 'Stock shown on product pages is live when updated. For specific availability, tell me the model.';
    if(q.includes('return')) return 'You can return items within 14 days in original packaging. Contact support for more help.';
    if(q.includes('price')) return 'Prices are listed on each product card. Currency shown is JMD where specified.';
    return 'Thanks — our team will get back to you soon. (This is an automated response.)';
  }

  function saveMessage(question, answer){
    const arr = JSON.parse(localStorage.getItem('ai_messages')||'[]');
    arr.push({ question, answer, createdAt: new Date().toISOString() });
    localStorage.setItem('ai_messages', JSON.stringify(arr));
  }

  sendBtn.addEventListener('click', ()=>{
    const q = input.value.trim();
    if(!q) return;
    const a = simulatedAI(q);
    // append UI quickly
    messagesEl.innerHTML += `<div class="msg question">${q}</div><div class="msg answer">${a}</div>`;
    messagesEl.scrollTop = messagesEl.scrollHeight;
    input.value = '';
    saveMessage(q,a);
  });

})();
