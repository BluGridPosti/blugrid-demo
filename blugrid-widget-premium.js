(function () {
  if (window.blugridPremiumLoaded) return;
  window.blugridPremiumLoaded = true;

  const cfg = window.BluGridWidgetConfig || {};

  const WEBHOOK_URL = cfg.webhookUrl || "";
  const BOOKING_URL = cfg.bookingUrl || "#";
  const COMPANY_NAME = cfg.companyName || "BluGrid AI Assistant";
  const SUBTITLE = cfg.subtitle || "Sales • Support • Qualification";
  const LOGO_URL = cfg.logoUrl || "";
  const PRIMARY = cfg.primaryColor || "#2563eb";
  const SECONDARY = cfg.secondaryColor || "#1d4ed8";
  const WELCOME_MESSAGE =
    cfg.welcomeMessage ||
    "Hi — welcome. I can answer questions, explain services, and help you request a quote or book a call.";
  const SERVICES_TEXT =
    cfg.servicesText ||
    "custom business software, automation systems, AI assistants, dashboards, portals, lead generation systems";

  if (!WEBHOOK_URL) {
    console.error("BluGrid Widget: webhookUrl is missing in window.BluGridWidgetConfig");
    return;
  }

  const style = document.createElement("style");
  style.innerHTML = `
    :root {
      --bg: #081120;
      --panel: #0f172a;
      --card: rgba(255,255,255,0.04);
      --line: rgba(255,255,255,0.08);
      --text: #e5e7eb;
      --muted: #94a3b8;
      --brand: ${PRIMARY};
      --brand-2: ${SECONDARY};
      --success: #22c55e;
      --shadow: 0 20px 60px rgba(2,6,23,0.35);
    }

    #bg-launcher {
      position: fixed;
      right: 20px;
      bottom: 20px;
      z-index: 99999;
      border: none;
      border-radius: 999px;
      padding: 14px 20px;
      background: linear-gradient(135deg, var(--brand), var(--brand-2));
      color: #fff;
      font-weight: 700;
      font-family: Arial, sans-serif;
      cursor: pointer;
      box-shadow: var(--shadow);
    }

    #bg-box {
      position: fixed;
      right: 20px;
      bottom: 84px;
      width: 390px;
      max-width: calc(100vw - 20px);
      height: 680px;
      max-height: calc(100vh - 100px);
      display: none;
      flex-direction: column;
      background: var(--panel);
      color: var(--text);
      border-radius: 22px;
      overflow: hidden;
      box-shadow: var(--shadow);
      z-index: 99999;
      border: 1px solid var(--line);
      font-family: Arial, sans-serif;
    }

    #bg-header {
      padding: 16px;
      background:
        radial-gradient(circle at top right, color-mix(in srgb, var(--brand) 22%, transparent), transparent 30%),
        linear-gradient(180deg, #111827, #0b1220);
      border-bottom: 1px solid var(--line);
    }

    .bg-headrow {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
    }

    .bg-brand-wrap {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 0;
    }

    .bg-brand-badge {
      width: 42px;
      height: 42px;
      border-radius: 12px;
      background: rgba(255,255,255,0.08);
      padding: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      flex-shrink: 0;
    }

    .bg-brand-badge img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
    }

    .bg-brand-fallback {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      color: #fff;
      background: linear-gradient(135deg, var(--brand), var(--brand-2));
      border-radius: 8px;
      font-size: 16px;
    }

    .bg-title {
      font-weight: 800;
      font-size: 16px;
      margin: 0;
      color: #fff;
    }

    .bg-sub {
      font-size: 12px;
      color: var(--muted);
      margin-top: 3px;
    }

    .bg-icon-wrap {
      display: flex;
      gap: 8px;
      flex-shrink: 0;
    }

    .bg-icon {
      border: none;
      background: rgba(255,255,255,0.06);
      color: #fff;
      border-radius: 12px;
      width: 38px;
      height: 38px;
      cursor: pointer;
      font-size: 16px;
    }

    .bg-chips {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-top: 14px;
    }

    .bg-chip {
      border: 1px solid var(--line);
      background: rgba(255,255,255,0.04);
      color: #fff;
      border-radius: 999px;
      padding: 10px 13px;
      font-size: 12px;
      cursor: pointer;
      text-align: center;
      font-family: Arial, sans-serif;
    }

    .bg-statusbar {
      margin-top: 12px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: #cbd5e1;
      background: rgba(34,197,94,0.12);
      border: 1px solid rgba(34,197,94,0.2);
      border-radius: 999px;
      padding: 8px 12px;
    }

    .bg-statusbar .dot {
      width: 8px;
      height: 8px;
      border-radius: 999px;
      background: var(--success);
    }

    #bg-messages {
      flex: 1;
      overflow-y: auto;
      padding: 14px;
      background:
        radial-gradient(circle at top right, color-mix(in srgb, var(--brand) 14%, transparent), transparent 20%),
        linear-gradient(180deg, #081120, #0b1730);
    }

    .bg-row {
      display: flex;
      margin-bottom: 12px;
    }

    .bg-row.user {
      justify-content: flex-end;
    }

    .bg-msg {
      max-width: 84%;
      padding: 12px 14px;
      border-radius: 18px;
      line-height: 1.55;
      font-size: 14px;
      white-space: pre-wrap;
      word-break: break-word;
    }

    .bg-bot {
      background: #1e293b;
      border-top-left-radius: 6px;
      color: var(--text);
    }

    .bg-user {
      background: linear-gradient(135deg, var(--brand), var(--brand-2));
      color: #fff;
      border-top-right-radius: 6px;
    }

    #bg-footer {
      padding: 12px;
      background: #0b1220;
      border-top: 1px solid var(--line);
    }

    .bg-inputrow {
      display: flex;
      gap: 10px;
      align-items: flex-end;
    }

    #bg-input {
      flex: 1;
      min-height: 48px;
      max-height: 120px;
      resize: none;
      border: 1px solid var(--line);
      background: #111827;
      color: #fff;
      border-radius: 14px;
      padding: 12px;
      outline: none;
      font-size: 14px;
      font-family: Arial, sans-serif;
    }

    #bg-send {
      height: 48px;
      min-width: 54px;
      border: none;
      border-radius: 14px;
      background: linear-gradient(135deg, var(--brand), var(--brand-2));
      color: #fff;
      cursor: pointer;
      font-weight: 800;
      font-size: 18px;
    }

    .bg-typing span {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #94a3b8;
      margin-right: 5px;
      animation: bg-bounce 1.2s infinite ease-in-out;
    }

    .bg-typing span:nth-child(2) { animation-delay: 0.15s; }
    .bg-typing span:nth-child(3) { animation-delay: 0.3s; }

    @keyframes bg-bounce {
      0%, 80%, 100% { transform: translateY(0); opacity: 0.35; }
      40% { transform: translateY(-6px); opacity: 1; }
    }

    .bg-lead {
      margin: 10px 0 14px;
      border: 1px solid var(--line);
      background: var(--card);
      border-radius: 18px;
      padding: 14px;
    }

    .bg-lead h3 {
      margin: 0 0 8px;
      font-size: 15px;
      color: #fff;
    }

    .bg-lead p {
      margin: 0 0 12px;
      color: var(--muted);
      font-size: 13px;
      line-height: 1.5;
    }

    .bg-field {
      margin-bottom: 10px;
    }

    .bg-field label {
      display: block;
      font-size: 12px;
      color: #cbd5e1;
      margin-bottom: 6px;
    }

    .bg-field input,
    .bg-field textarea,
    .bg-field select {
      width: 100%;
      border-radius: 12px;
      border: 1px solid var(--line);
      background: #0b1220;
      color: #fff;
      padding: 12px;
      outline: none;
      font-size: 14px;
      font-family: Arial, sans-serif;
    }

    .bg-field textarea {
      min-height: 82px;
      resize: vertical;
    }

    .bg-actions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin-top: 12px;
    }

    .bg-btn {
      border: none;
      border-radius: 12px;
      padding: 12px 14px;
      cursor: pointer;
      font-weight: 700;
      font-family: Arial, sans-serif;
    }

    .bg-primary {
      background: linear-gradient(135deg, var(--brand), var(--brand-2));
      color: #fff;
    }

    .bg-secondary {
      background: rgba(255,255,255,0.06);
      color: #fff;
      border: 1px solid var(--line);
    }

    @media (max-width: 768px) {
      #bg-box {
        right: 0;
        bottom: 0;
        width: 100vw;
        height: 100dvh;
        max-height: 100dvh;
        max-width: 100vw;
        border-radius: 0;
      }

      #bg-launcher {
        right: 12px;
        bottom: 12px;
      }

      body.bg-chat-open #bg-launcher {
        display: none;
      }

      #bg-header {
        padding: 14px;
      }

      .bg-chip {
        font-size: 11px;
        padding: 10px 10px;
      }

      #bg-messages {
        padding: 12px;
      }

      .bg-msg {
        max-width: 90%;
        font-size: 15px;
      }

      #bg-footer {
        padding: 10px;
        padding-bottom: calc(10px + env(safe-area-inset-bottom));
      }

      .bg-inputrow {
        gap: 8px;
      }

      #bg-input {
        min-height: 48px;
        font-size: 16px;
      }

      #bg-send {
        min-width: 56px;
        height: 48px;
      }
    }
  `;
  document.head.appendChild(style);

  const initials = COMPANY_NAME.split(" ").slice(0, 2).map(w => w[0] || "").join("").toUpperCase();

  const logoMarkup = LOGO_URL
    ? `<img src="${LOGO_URL}" alt="${COMPANY_NAME} Logo" onerror="this.parentElement.innerHTML='<div class=&quot;bg-brand-fallback&quot;>${initials}</div>'" />`
    : `<div class="bg-brand-fallback">${initials}</div>`;

  const launcher = document.createElement("button");
  launcher.id = "bg-launcher";
  launcher.textContent = "Chat with us";

  const box = document.createElement("div");
  box.id = "bg-box";
  box.innerHTML = `
    <div id="bg-header">
      <div class="bg-headrow">
        <div class="bg-brand-wrap">
          <div class="bg-brand-badge">
            ${logoMarkup}
          </div>
          <div>
            <div class="bg-title">${COMPANY_NAME}</div>
            <div class="bg-sub">${SUBTITLE}</div>
          </div>
        </div>

        <div class="bg-icon-wrap">
          <button class="bg-icon" id="bg-reset" title="Reset">↺</button>
          <button class="bg-icon" id="bg-close" title="Close">✕</button>
        </div>
      </div>

      <div class="bg-chips">
        <button class="bg-chip" data-prompt="What services do you offer?">What do you do?</button>
        <button class="bg-chip" data-prompt="How can this help my business?">AI assistant value</button>
        <button class="bg-chip" data-prompt="How quickly can this be installed?">Deployment speed</button>
        <button class="bg-chip" id="bg-bookchip">Book a call</button>
      </div>

      <div class="bg-statusbar">
        <span class="dot"></span>
        <span>Typically replies in seconds</span>
      </div>
    </div>

    <div id="bg-messages"></div>

    <div id="bg-footer">
      <div class="bg-inputrow">
        <textarea id="bg-input" placeholder="Type your message..."></textarea>
        <button id="bg-send">➜</button>
      </div>
    </div>
  `;

  document.body.appendChild(launcher);
  document.body.appendChild(box);

  const messages = box.querySelector("#bg-messages");
  const input = box.querySelector("#bg-input");
  const sendBtn = box.querySelector("#bg-send");
  const closeBtn = box.querySelector("#bg-close");
  const resetBtn = box.querySelector("#bg-reset");
  const chips = box.querySelectorAll(".bg-chip[data-prompt]");
  const bookchip = box.querySelector("#bg-bookchip");

  let open = false;
  let sending = false;
  let typingEl = null;
  let leadShown = false;
  let conversationId = "conv_" + Date.now() + "_" + Math.floor(Math.random() * 10000);

  function esc(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }

  function grow() {
    input.style.height = "48px";
    input.style.height = Math.min(input.scrollHeight, 120) + "px";
  }

  function add(text, sender) {
    const row = document.createElement("div");
    row.className = "bg-row " + sender;

    const bubble = document.createElement("div");
    bubble.className = "bg-msg " + (sender === "user" ? "bg-user" : "bg-bot");
    bubble.innerHTML = esc(text).replace(/\n/g, "<br>");

    row.appendChild(bubble);
    messages.appendChild(row);
    messages.scrollTop = messages.scrollHeight;
  }

  function renderWelcome() {
    messages.innerHTML = "";
    add(WELCOME_MESSAGE, "bot");
  }

  function showTyping() {
    hideTyping();

    const row = document.createElement("div");
    row.className = "bg-row bot";

    const bubble = document.createElement("div");
    bubble.className = "bg-msg bg-bot";
    bubble.innerHTML = '<div class="bg-typing"><span></span><span></span><span></span></div>';

    row.appendChild(bubble);
    messages.appendChild(row);
    messages.scrollTop = messages.scrollHeight;
    typingEl = row;
  }

  function hideTyping() {
    if (typingEl) {
      typingEl.remove();
      typingEl = null;
    }
  }

  function toggle(force) {
    open = typeof force === "boolean" ? force : !open;
    box.style.display = open ? "flex" : "none";
    document.body.classList.toggle("bg-chat-open", open);
  }

  function showLeadForm() {
    if (leadShown || box.querySelector("#bg-lead-card")) return;
    leadShown = true;

    const card = document.createElement("div");
    card.className = "bg-lead";
    card.id = "bg-lead-card";
    card.innerHTML = `
      <h3>Let’s turn this into a real opportunity</h3>
      <p>Drop your details and ${COMPANY_NAME} can follow up with a tailored response.</p>

      <div class="bg-field">
        <label>Full name</label>
        <input id="bg-lead-name" placeholder="John Smith" />
      </div>

      <div class="bg-field">
        <label>Email</label>
        <input id="bg-lead-email" type="email" placeholder="john@company.com" />
      </div>

      <div class="bg-field">
        <label>Phone</label>
        <input id="bg-lead-phone" placeholder="+27 82 123 4567" />
      </div>

      <div class="bg-field">
        <label>Company</label>
        <input id="bg-lead-company" placeholder="Company name" />
      </div>

      <div class="bg-field">
        <label>Service needed</label>
        <select id="bg-lead-service">
          <option value="General enquiry">General enquiry</option>
          <option value="Quote request">Quote request</option>
          <option value="Installation">Installation</option>
          <option value="Support">Support</option>
        </select>
      </div>

      <div class="bg-field">
        <label>Biggest problem</label>
        <textarea id="bg-lead-problem" placeholder="Tell us what you need help with..."></textarea>
      </div>

      <div class="bg-actions">
        <button class="bg-btn bg-primary" id="bg-submit-lead">Send details</button>
        <button class="bg-btn bg-secondary" id="bg-book-now">Book a call</button>
      </div>
    `;

    messages.appendChild(card);
    messages.scrollTop = messages.scrollHeight;

    card.querySelector("#bg-submit-lead").addEventListener("click", submitLead);
    card.querySelector("#bg-book-now").addEventListener("click", () => window.open(BOOKING_URL, "_blank"));
  }

  async function submitLead() {
    const full_name = box.querySelector("#bg-lead-name").value.trim();
    const email = box.querySelector("#bg-lead-email").value.trim();
    const phone = box.querySelector("#bg-lead-phone").value.trim();
    const company_name = box.querySelector("#bg-lead-company").value.trim();
    const service_interest = box.querySelector("#bg-lead-service").value;
    const biggest_problem = box.querySelector("#bg-lead-problem").value.trim();

    if (!full_name || !email || !service_interest) {
      alert("Please fill in full name, email, and service needed.");
      return;
    }

    const btn = box.querySelector("#bg-submit-lead");
    btn.textContent = "Sending...";
    btn.disabled = true;

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_type: "lead_capture",
          conversation_id: conversationId,
          page_url: window.location.href,
          lead: {
            full_name,
            email,
            phone,
            company_name,
            website: window.location.hostname || "Website",
            service_interest,
            monthly_lead_volume: "",
            biggest_problem
          }
        })
      });

      const rawText = await res.text();
      let data;

      try {
        data = JSON.parse(rawText);
      } catch (e) {
        alert("Server returned an invalid response.");
        console.error("Lead JSON parse error:", e, rawText);
        btn.textContent = "Send details";
        btn.disabled = false;
        return;
      }

      if (data.ok) {
        box.querySelector("#bg-lead-card").innerHTML = `
          <h3>Details received</h3>
          <p>Perfect — ${COMPANY_NAME} has your details and should follow up shortly.</p>
          <div class="bg-actions">
            <button class="bg-btn bg-primary" id="bg-final-book">Book a call now</button>
          </div>
        `;
        box.querySelector("#bg-final-book").addEventListener("click", () => window.open(BOOKING_URL, "_blank"));
        add("Thanks — your details have been captured. Someone should follow up with you shortly.", "bot");
      } else {
        alert((data.errors || []).join(", ") || data.message || "Lead capture failed.");
        btn.textContent = "Send details";
        btn.disabled = false;
      }
    } catch (e) {
      alert("Could not send your details right now.");
      console.error(e);
      btn.textContent = "Send details";
      btn.disabled = false;
    }
  }

  async function sendMessage(text) {
    if (!text || sending) return;

    sending = true;
    add(text, "user");
    showTyping();

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_type: "chat",
          message: text,
          conversation_id: conversationId,
          page_url: window.location.href,
          visitor: { user_agent: navigator.userAgent },
          metadata: {
            business_name: COMPANY_NAME,
            services: SERVICES_TEXT
          }
        })
      });

      const rawText = await res.text();
      let data;

      try {
        data = JSON.parse(rawText);
      } catch (e) {
        hideTyping();
        add("Server replied, but the response was not valid JSON.", "bot");
        console.error("JSON parse error:", e, rawText);
        return;
      }

      hideTyping();

      if (data.reply) {
        add(data.reply, "bot");

        if (
          data.handoff_suggested ||
          /book|call|quote|pricing|details|contact|email|phone/i.test(data.reply)
        ) {
          setTimeout(showLeadForm, 500);
        }
      } else {
        add("The server responded, but no reply field was found.", "bot");
        console.log("Unexpected response shape:", data);
      }
    } catch (e) {
      hideTyping();
      add("Connection error. Please try again in a moment.", "bot");
      console.error(e);
    } finally {
      sending = false;
    }
  }

  launcher.addEventListener("click", () => toggle());
  closeBtn.addEventListener("click", () => toggle(false));

  resetBtn.addEventListener("click", () => {
    conversationId = "conv_" + Date.now() + "_" + Math.floor(Math.random() * 10000);
    leadShown = false;
    renderWelcome();
  });

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      toggle(true);
      sendMessage(chip.dataset.prompt);
    });
  });

  bookchip.addEventListener("click", () => window.open(BOOKING_URL, "_blank"));

  sendBtn.addEventListener("click", () => {
    const text = input.value.trim();
    if (!text) return;
    input.value = "";
    grow();
    sendMessage(text);
  });

  input.addEventListener("input", grow);

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      input.value = "";
      grow();
      sendMessage(text);
    }
  });

  renderWelcome();
  grow();
})();