(function() {
  const API_URL = 'https://calcuttanode-api.onrender.com/api/ai/chat';
  let isOpen = false;
  let chatWidget = null;
  let chatPanel = null;
  let fabBtn = null;

  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .cw-fab {
        position: fixed; bottom: 24px; right: 24px; z-index: 9999;
        width: 56px; height: 56px; border-radius: 50%;
        background: #00ff41; border: none; cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        box-shadow: 0 4px 20px rgba(0,255,65,0.3);
        transition: all 0.3s ease;
        font-size: 1.5rem; color: #0a0a0a;
        animation: cw-pulse 3s ease-in-out infinite;
      }
      .cw-fab:hover { transform: scale(1.1); box-shadow: 0 6px 28px rgba(0,255,65,0.5); }
      .cw-fab.cw-open { animation: none; }
      .cw-fab svg { width: 24px; height: 24px; }
      .cw-panel {
        position: fixed; bottom: 90px; right: 24px; z-index: 9998;
        width: 360px; max-height: 560px; border-radius: 16px;
        background: #111; border: 1px solid rgba(0,255,65,0.15);
        box-shadow: 0 8px 40px rgba(0,0,0,0.5);
        display: none; flex-direction: column; overflow: hidden;
        transform: translateY(20px); opacity: 0;
        transition: all 0.3s ease;
      }
      .cw-panel.open { display: flex; transform: translateY(0); opacity: 1; }
      .cw-header {
        display: flex; align-items: center; justify-content: space-between;
        padding: 14px 16px; background: #0d0d0d;
        border-bottom: 1px solid rgba(0,255,65,0.1);
        font-family: 'JetBrains Mono', monospace;
      }
      .cw-header h3 { font-size: 0.85rem; color: #00ff41; margin: 0; font-weight: 700; }
      .cw-header span { font-size: 0.7rem; color: #999; }
      .cw-close {
        background: none; border: none; color: #999; cursor: pointer;
        font-size: 1.2rem; padding: 4px; line-height: 1;
        transition: color 0.2s;
      }
      .cw-close:hover { color: #ff3355; }
      .cw-messages {
        flex: 1; overflow-y: auto; padding: 16px;
        display: flex; flex-direction: column; gap: 10px;
        background: #0a0a0a;
        min-height: 300px; max-height: 360px;
      }
      .cw-messages::-webkit-scrollbar { width: 4px; }
      .cw-messages::-webkit-scrollbar-track { background: transparent; }
      .cw-messages::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
      .cw-msg {
        max-width: 85%; padding: 10px 14px; border-radius: 12px;
        font-size: 0.82rem; line-height: 1.5; word-wrap: break-word;
        font-family: system-ui, sans-serif; animation: cw-fade 0.3s ease;
      }
      .cw-msg.bot {
        align-self: flex-start; background: #1a1a1a;
        color: #ccc; border-bottom-left-radius: 4px;
      }
      .cw-msg.user {
        align-self: flex-end; background: rgba(0,255,65,0.12);
        color: #00ff41; border-bottom-right-radius: 4px;
      }
      .cw-msg.error {
        align-self: flex-start; background: rgba(255,51,85,0.1);
        color: #ff3355; border-bottom-left-radius: 4px;
      }
      .cw-input-area {
        display: flex; gap: 8px; padding: 12px 16px;
        background: #0d0d0d; border-top: 1px solid rgba(0,255,65,0.1);
        position: sticky; bottom: 0;
      }
      .cw-input {
        flex: 1; padding: 9px 14px; border-radius: 8px;
        border: 1px solid rgba(0,255,65,0.12); background: #1a1a1a;
        color: #e0e0e0; font-size: 0.82rem; outline: none;
        font-family: 'JetBrains Mono', monospace;
        transition: border-color 0.2s;
      }
      .cw-input:focus { border-color: #00ff41; }
      .cw-input::placeholder { color: #666; }
      .cw-send {
        padding: 9px 16px; border-radius: 8px; border: none;
        background: #00ff41; color: #0a0a0a; cursor: pointer;
        font-weight: 600; font-size: 0.82rem;
        font-family: 'JetBrains Mono', monospace;
        transition: all 0.2s; white-space: nowrap;
      }
      .cw-send:hover { background: #00ff4d; box-shadow: 0 0 12px rgba(0,255,65,0.3); }
      .cw-send:disabled { opacity: 0.5; cursor: not-allowed; }
      .cw-typing {
        align-self: flex-start; background: #1a1a1a; color: #999;
        padding: 10px 14px; border-radius: 12px; font-size: 0.82rem;
        border-bottom-left-radius: 4px; animation: cw-fade 0.3s ease;
      }
      .cw-typing::after { content: '...'; animation: cw-dots 1.5s infinite; }
      @keyframes cw-fade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes cw-dots { 0%,20% { content: '.'; } 40% { content: '..'; } 60%,100% { content: '...'; } }
      @keyframes cw-pulse {
        0%, 100% { box-shadow: 0 4px 20px rgba(0,255,65,0.3); }
        50% { box-shadow: 0 4px 30px rgba(0,255,65,0.5), 0 0 0 8px rgba(0,255,65,0.08); }
      }
      @media (max-width: 480px) {
        .cw-panel { width: calc(100vw - 32px); right: 16px; bottom: 82px; }
        .cw-messages { min-height: 260px; max-height: 320px; }
        .cw-input-area { padding-bottom: max(12px, env(safe-area-inset-bottom)); }
      }
    `;
    document.head.appendChild(style);
  }

  function addMessage(text, type) {
    const msgs = chatPanel.querySelector('.cw-messages');
    const div = document.createElement('div');
    div.className = 'cw-msg ' + type;
    div.textContent = text;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function showTyping() {
    const msgs = chatPanel.querySelector('.cw-messages');
    const div = document.createElement('div');
    div.className = 'cw-typing';
    div.id = 'cwTyping';
    div.textContent = 'Calcutta Node AI is thinking';
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function hideTyping() {
    const el = document.getElementById('cwTyping');
    if (el) el.remove();
  }

  async function sendMessage(text) {
    const sendBtn = chatPanel.querySelector('.cw-send');
    sendBtn.disabled = true;
    addMessage(text, 'user');
    showTyping();
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      hideTyping();
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();
      addMessage(data.reply || data.response || data.message || JSON.stringify(data), 'bot');
    } catch (err) {
      hideTyping();
      addMessage('Sorry, I couldn\'t reach Calcutta Node AI right now. Please try again later.', 'error');
    } finally {
      sendBtn.disabled = false;
      chatPanel.querySelector('.cw-input').focus();
    }
  }

  function buildUI() {
    fabBtn = document.createElement('button');
    fabBtn.className = 'cw-fab';
    fabBtn.setAttribute('aria-label', 'Open AI Chat');
    fabBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
    document.body.appendChild(fabBtn);

    chatPanel = document.createElement('div');
    chatPanel.className = 'cw-panel';
    chatPanel.innerHTML = `
      <div class="cw-header">
        <div><h3>Calcutta Node AI</h3><span>Ask me anything</span></div>
        <button class="cw-close" aria-label="Close chat">&times;</button>
      </div>
      <div class="cw-messages">
        <div class="cw-msg bot">Hello! I'm Calcutta Node's AI assistant. I can help you with services, pricing, project inquiries, and more. How can I assist you today?</div>
      </div>
      <div class="cw-input-area">
        <input class="cw-input" type="text" placeholder="Type a message..." />
        <button class="cw-send">Send</button>
      </div>
    `;
    document.body.appendChild(chatPanel);

    const closeBtn = chatPanel.querySelector('.cw-close');
    const input = chatPanel.querySelector('.cw-input');
    const sendBtn = chatPanel.querySelector('.cw-send');

    function toggle() {
      isOpen = !isOpen;
      chatPanel.classList.toggle('open', isOpen);
      fabBtn.classList.toggle('cw-open', isOpen);
      fabBtn.innerHTML = isOpen
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
      if (isOpen) {
        fabBtn.setAttribute('aria-label', 'Close AI Chat');
        setTimeout(() => input.focus(), 300);
      } else {
        fabBtn.setAttribute('aria-label', 'Open AI Chat');
      }
    }

    fabBtn.addEventListener('click', toggle);
    closeBtn.addEventListener('click', toggle);

    function handleSend() {
      const text = input.value.trim();
      if (!text || sendBtn.disabled) return;
      input.value = '';
      sendMessage(text);
    }

    sendBtn.addEventListener('click', handleSend);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSend();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      injectStyles();
      buildUI();
    });
  } else {
    injectStyles();
    buildUI();
  }
})();
