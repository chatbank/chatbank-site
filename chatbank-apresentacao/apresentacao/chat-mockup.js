/* ============================================================
   Chat mockup helpers — DOM-preserving (children stay intact)
   Run after DOMContentLoaded; transforms semantic tags in place.
   ============================================================ */

(function () {
  function transformBubbles(root) {
    // c-them / c-me  → div.bubble.them / .bubble.me
    root.querySelectorAll("c-them, c-me").forEach((el) => {
      const isMe = el.tagName.toLowerCase() === "c-me";
      const time = el.getAttribute("time") || "";
      const wrap = document.createElement("div");
      wrap.className = "bubble " + (isMe ? "me" : "them");
      while (el.firstChild) wrap.appendChild(el.firstChild);
      if (time) {
        const t = document.createElement("span");
        t.className = "time";
        t.innerHTML = isMe
          ? `${time} <span class="tick">✓✓</span>`
          : time;
        wrap.appendChild(t);
      }
      el.replaceWith(wrap);
    });

    // c-day
    root.querySelectorAll("c-day").forEach((el) => {
      const d = document.createElement("div");
      d.className = "chat-day";
      d.textContent = el.textContent;
      el.replaceWith(d);
    });

    // c-flow
    root.querySelectorAll("c-flow").forEach((el) => {
      const head = el.getAttribute("head") || "";
      const sub = el.getAttribute("sub") || "";
      const cta = el.getAttribute("cta") || "Abrir";
      const time = el.getAttribute("time") || "";
      const inner = el.innerHTML;
      const wrap = document.createElement("div");
      wrap.className = "flow-card";
      wrap.innerHTML = `
        ${inner ? `<div class="sub" style="color:rgba(255,255,255,0.92);font-size:12.5px;line-height:1.42;">${inner}</div>` : ""}
        ${head ? `<div class="head">${head}</div>` : ""}
        ${sub ? `<div class="sub">${sub}</div>` : ""}
        <div class="cta"><span style="display:inline-block;width:10px;height:10px;border:1.5px solid currentColor;border-radius:2px;margin-right:6px;"></span>${cta}</div>
        ${time ? `<div class="meta-row"><span></span><span>${time} <span style="color:#4fc3f7;font-weight:700;letter-spacing:-2px;">✓✓</span></span></div>` : ""}
      `;
      el.replaceWith(wrap);
    });

    // c-list
    root.querySelectorAll("c-list").forEach((el) => {
      const head = el.getAttribute("head") || "";
      const body = el.getAttribute("body") || "";
      const items = (el.getAttribute("items") || "").split("|").filter(Boolean);
      const time = el.getAttribute("time") || "";
      const wrap = document.createElement("div");
      wrap.className = "list-bubble";
      wrap.innerHTML = `
        ${head ? `<div class="lb-head">${head}</div>` : ""}
        ${body ? `<div class="lb-body">${body}</div>` : ""}
        ${items.map((i) => `<div class="lb-item"><span>${i}</span><span>›</span></div>`).join("")}
        ${time ? `<div style="text-align:right;padding:4px 10px 6px 10px;font-size:9px;color:rgba(255,255,255,0.45)">${time} <span style="color:#4fc3f7;font-weight:700;letter-spacing:-2px;">✓✓</span></div>` : ""}
      `;
      el.replaceWith(wrap);
    });
  }

  function transformPhones(root) {
    root.querySelectorAll("chat-mockup").forEach((el) => {
      const name = el.getAttribute("name") || "Banco";
      const status = el.getAttribute("status") || "online";
      const avatar = el.getAttribute("avatar") || name[0];
      const time = el.getAttribute("time") || "10:42";
      const scale = el.getAttribute("scale");
      const animate = el.getAttribute("animate") !== "false";

      // First transform inner semantic tags
      transformBubbles(el);

      const phone = document.createElement("div");
      phone.className = "phone";

      phone.innerHTML = `
        <div class="phone-screen">
          <div class="chat">
            <div class="status-bar" style="position:absolute;top:0;left:0;right:0;height:32px;display:flex;justify-content:space-between;align-items:center;padding:8px 24px 0 24px;font-size:12px;font-family:var(--font-display);font-weight:600;color:#fff;z-index:9;">
              <span>${time}</span>
              <span style="display:flex;gap:6px;align-items:center;font-size:10px;opacity:0.95;">
                <span>5G</span>
                <span style="display:inline-block;width:20px;height:10px;border:1px solid #fff;border-radius:2px;position:relative;">
                  <span style="position:absolute;top:1px;left:1px;bottom:1px;background:#fff;border-radius:1px;width:80%;display:block;"></span>
                </span>
              </span>
            </div>
            <div class="chat-header">
              <div class="avatar">${avatar}</div>
              <div class="meta">
                <div class="name">${name}<span class="verified"></span></div>
                <div class="status">${status}</div>
              </div>
              <div style="display:flex;gap:14px;color:rgba(255,255,255,0.5);font-size:18px;">⌕ ⋮</div>
            </div>
            <div class="chat-body"></div>
            <div class="chat-input">
              <div class="field">Mensagem</div>
              <div class="send"><span style="display:inline-block;transform:translateX(1px)">▶</span></div>
            </div>
          </div>
        </div>
      `;

      const body = phone.querySelector(".chat-body");
      while (el.firstChild) body.appendChild(el.firstChild);

      if (scale) {
        const s = parseFloat(scale);
        const wrap = document.createElement("div");
        wrap.style.width = (360 * s) + "px";
        wrap.style.height = (740 * s) + "px";
        wrap.style.flexShrink = "0";
        wrap.style.position = "relative";
        phone.style.transform = `scale(${scale})`;
        phone.style.transformOrigin = "top left";
        wrap.appendChild(phone);
        wrap.classList.add("chat-mockup-wrap");
        if (animate) wrap.dataset.animate = "1";
        el.replaceWith(wrap);
      } else {
        phone.classList.add("chat-mockup-wrap");
        if (animate) phone.dataset.animate = "1";
        el.replaceWith(phone);
      }
    });
  }

  // -----------------------------------------------------------
  // Animation: stagger bubbles fade-in with "typing" indicator
  // -----------------------------------------------------------
  const TYPING_HTML = `
    <div class="typing-indicator" style="align-self:flex-start; background:var(--chat-bubble-them); border-radius:10px; border-top-left-radius:2px; padding:8px 12px; display:inline-flex; gap:4px; opacity:0; transform:translateY(6px); transition:opacity .2s, transform .2s;">
      <span style="width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,0.55);animation:typing-bounce 1s infinite;animation-delay:0s;"></span>
      <span style="width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,0.55);animation:typing-bounce 1s infinite;animation-delay:.15s;"></span>
      <span style="width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,0.55);animation:typing-bounce 1s infinite;animation-delay:.30s;"></span>
    </div>`;

  // Inject the typing-bounce keyframes once
  if (!document.getElementById("chat-anim-style")) {
    const s = document.createElement("style");
    s.id = "chat-anim-style";
    s.textContent = `
      @keyframes typing-bounce {
        0%, 60%, 100% { transform: translateY(0); opacity: 0.45; }
        30% { transform: translateY(-4px); opacity: 1; }
      }
      @keyframes flow-pulse {
        0%, 100% { box-shadow: 0 0 0 0 rgba(31,181,115,0); }
        50% { box-shadow: 0 0 0 4px rgba(31,181,115,0.18); }
      }
      .chat-mockup-wrap [data-anim-item] {
        opacity: 0;
        transform: translateY(8px) scale(0.97);
        will-change: opacity, transform;
      }
      .chat-mockup-wrap.playing [data-anim-item].in {
        opacity: 1;
        transform: translateY(0) scale(1);
        transition: opacity .26s ease-out, transform .26s ease-out;
      }
      .chat-mockup-wrap .flow-card .cta {
        animation: flow-pulse 2.2s ease-in-out infinite;
        border-radius: 6px;
      }
      .chat-body-anim-cursor {
        display:inline-block; width: 6px; height: 12px;
        background: rgba(255,255,255,0.6);
        vertical-align: middle;
        margin-left: 2px;
        animation: chat-caret 1s steps(2) infinite;
      }
      @keyframes chat-caret { 0%, 50% { opacity: 1; } 50.01%, 100% { opacity: 0; } }
    `;
    document.head.appendChild(s);
  }

  function prepareChat(wrap) {
    if (wrap._prepared) return;
    wrap._prepared = true;
    const body = wrap.querySelector(".chat-body");
    if (!body) return;
    const items = Array.from(body.children);
    items.forEach((item) => {
      item.setAttribute("data-anim-item", "");
    });
    // Build a timeline keyed to items in original order. Typing indicators
    // are inserted just before "them"/flow/list items, then removed when the
    // item reveals. We do not reorder; we only toggle classes / insert+remove.
    const timeline = [];
    let t = 250;
    items.forEach((item) => {
      const isThem = item.classList.contains("bubble") && item.classList.contains("them");
      const isFlowOrList = item.classList.contains("flow-card") || item.classList.contains("list-bubble");
      const showTyping = isThem || isFlowOrList;
      if (showTyping) {
        timeline.push({ kind: "typing", at: t, dur: 650, before: item });
        t += 650;
      }
      timeline.push({ kind: "show", at: t, el: item });
      t += isFlowOrList ? 950 : 650;
    });
    wrap._timeline = timeline;
    wrap._endTime = t + 400;
    wrap._items = items;
    wrap._body = body;
  }

  function playChat(wrap) {
    prepareChat(wrap);
    if (!wrap._timeline) return;
    // Reset prior run
    if (wrap._timers) wrap._timers.forEach(clearTimeout);
    wrap._timers = [];
    wrap._items.forEach((it) => it.classList.remove("in"));
    wrap._body.querySelectorAll(".typing-indicator").forEach((n) => n.remove());
    wrap.classList.add("playing");

    wrap._timeline.forEach((step) => {
      if (step.kind === "typing") {
        wrap._timers.push(setTimeout(() => {
          const t = document.createElement("div");
          t.innerHTML = TYPING_HTML.trim();
          const node = t.firstElementChild;
          // Insert typing indicator just before the upcoming item, in place
          wrap._body.insertBefore(node, step.before);
          requestAnimationFrame(() => {
            node.style.opacity = "1";
            node.style.transform = "translateY(0)";
          });
          wrap._timers.push(setTimeout(() => {
            node.style.opacity = "0";
            wrap._timers.push(setTimeout(() => node.remove(), 220));
          }, step.dur - 80));
        }, step.at));
      } else if (step.kind === "show") {
        wrap._timers.push(setTimeout(() => {
          step.el.classList.add("in");
        }, step.at));
      }
    });

    // Loop after end + pause
    wrap._timers.push(setTimeout(() => playChat(wrap), wrap._endTime + 3200));
  }

  function setupAnimations() {
    const wraps = Array.from(document.querySelectorAll('.chat-mockup-wrap[data-animate="1"]'));
    if (wraps.length === 0) return;

    // Pre-hide all chat items
    wraps.forEach((w) => prepareChat(w));

    // Trigger when a slide containing chat-mockup-wraps becomes active.
    // We listen to the deck-stage's slidechange event; also kick off once on init.
    const deck = document.querySelector("deck-stage");
    const playInsideSlide = (slideEl) => {
      if (!slideEl) return;
      slideEl.querySelectorAll('.chat-mockup-wrap[data-animate="1"]').forEach((w) => {
        // small jitter to make multiple phones feel asynchronous
        const jitter = Math.random() * 350;
        setTimeout(() => playChat(w), jitter);
      });
    };

    if (deck) {
      deck.addEventListener("slidechange", (e) => {
        const slide = e.detail && e.detail.slide;
        playInsideSlide(slide);
      });
      // Initial: find currently active slide (data-deck-active)
      const tryInit = (n) => {
        const active = deck.querySelector('section[data-deck-active]');
        if (active) playInsideSlide(active);
        else if (n < 30) setTimeout(() => tryInit(n + 1), 100);
      };
      tryInit(0);
    } else {
      // No deck — just play all
      wraps.forEach((w) => playChat(w));
    }
  }

  function run() {
    transformPhones(document);
    // Defer animation setup slightly so the deck-stage initializes first
    setTimeout(setupAnimations, 50);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
