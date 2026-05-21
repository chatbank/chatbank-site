/* ============================================================
   Interactive cover — chip-driven WhatsApp conversation
   ============================================================ */
(function () {
  const SCENARIOS = {
    pix: {
      userText: "faz um pix de 50 pra maria",
      steps: [
        {
          type: "them",
          html: 'Encontrei <strong>Maria Silva</strong> · CPF ***.412.***-90 nos seus contatos.<br/>Confirma <strong>R$ 50,00</strong>?',
        },
        {
          type: "flow",
          html: `
            <div style="color:#fff; font-weight:600; font-size:12.5px; margin-bottom:2px;">Confirmar Pix</div>
            <div style="font-size:11px; color:rgba(255,255,255,0.65); line-height:1.4;">R$ 50,00 · pra Maria Silva · Banco do Brasil</div>
            <div style="border-top:1px solid rgba(255,255,255,0.08); margin-top:6px; padding-top:8px; display:flex; align-items:center; justify-content:center; gap:6px; font-size:12px; font-weight:600; color:var(--chat-green);">
              <span style="display:inline-block;width:10px;height:10px;border:1.5px solid currentColor;border-radius:2px;"></span>
              Autorizar com biometria
            </div>`,
        },
        {
          type: "them",
          html: '✅ Pix de <strong>R$ 50,00</strong> enviado pra Maria às 14:03.<br/>Comprovante <strong>PIX-9F2A1B</strong>.',
        },
      ],
    },
    saldo: {
      userText: "qual meu saldo",
      steps: [
        {
          type: "list",
          html: `
            <div style="padding:8px 10px 4px 10px; font-weight:600; color:#fff; font-size:12.5px;">Suas contas</div>
            <div style="padding:0 10px 8px 10px; font-size:11px; color:rgba(255,255,255,0.7); line-height:1.4;">Visão consolidada · Open Finance</div>
            <div style="border-top:1px solid rgba(255,255,255,0.06); padding:8px 10px; display:flex; justify-content:space-between; font-size:12px; color:#fff;">
              <span>Conta corrente</span><strong style="color:var(--chat-green);">R$ 2.840,15</strong>
            </div>
            <div style="border-top:1px solid rgba(255,255,255,0.06); padding:8px 10px; display:flex; justify-content:space-between; font-size:12px; color:#fff;">
              <span>Poupança</span><strong style="color:var(--chat-green);">R$ 12.460,00</strong>
            </div>
            <div style="border-top:1px solid rgba(255,255,255,0.06); padding:8px 10px; display:flex; justify-content:space-between; font-size:12px; color:#fff;">
              <span>Cartão (disponível)</span><strong style="color:var(--chat-green);">R$ 4.180,00</strong>
            </div>`,
        },
        {
          type: "them",
          html: "Posso te ajudar com mais alguma coisa?",
        },
      ],
    },
    gas: {
      userText: "vale-gás",
      steps: [
        {
          type: "them",
          html: "Você tem direito a <strong>1 botijão</strong> este mês, Marina. Crédito de <strong>R$ 110,00</strong> disponível.",
        },
        {
          type: "flow",
          html: `
            <div style="font-size:11.5px; color:rgba(255,255,255,0.85); line-height:1.4; margin-bottom:4px;">Pedido em 1 clique · entrega no mesmo dia</div>
            <div style="color:#fff; font-weight:600; font-size:12.5px;">Pedir vale-gás agora</div>
            <div style="font-size:11px; color:rgba(255,255,255,0.65); line-height:1.4;">Distribuidora Atlas · 13kg · grátis</div>
            <div style="border-top:1px solid rgba(255,255,255,0.08); margin-top:6px; padding-top:8px; display:flex; align-items:center; justify-content:center; gap:6px; font-size:12px; font-weight:600; color:var(--chat-green);">
              <span style="display:inline-block;width:10px;height:10px;border:1.5px solid currentColor;border-radius:2px;"></span>
              Pedir
            </div>`,
        },
      ],
    },
    extrato: {
      userText: "extrato do mês",
      steps: [
        {
          type: "list",
          html: `
            <div style="padding:8px 10px 4px 10px; font-weight:600; color:#fff; font-size:12.5px;">Extrato · novembro</div>
            <div style="padding:0 10px 8px 10px; font-size:11px; color:rgba(255,255,255,0.7); line-height:1.4;">17 movimentações · saldo R$ 2.840,15</div>
            <div style="border-top:1px solid rgba(255,255,255,0.06); padding:8px 10px; display:flex; justify-content:space-between; font-size:12px; color:#fff;">
              <span>Pix recebido · Carlos</span><strong style="color:var(--chat-green);">+ R$ 320,00</strong>
            </div>
            <div style="border-top:1px solid rgba(255,255,255,0.06); padding:8px 10px; display:flex; justify-content:space-between; font-size:12px; color:#fff;">
              <span>Mercado iFood</span><strong style="color:#ff7a6c;">− R$ 184,90</strong>
            </div>
            <div style="border-top:1px solid rgba(255,255,255,0.06); padding:8px 10px; display:flex; justify-content:space-between; font-size:12px; color:#fff;">
              <span>Salário · ACME</span><strong style="color:var(--chat-green);">+ R$ 4.500,00</strong>
            </div>`,
        },
        {
          type: "them",
          html: "Quer baixar o extrato em PDF?",
        },
      ],
    },
  };

  function nowTime() {
    const d = new Date();
    return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
  }

  function mkBubble(type, html, opts = {}) {
    const wrap = document.createElement("div");
    if (type === "user") {
      wrap.className = "bubble me live";
      wrap.innerHTML = html + `<span class="time">${nowTime()} <span class="tick">✓✓</span></span>`;
    } else if (type === "them") {
      wrap.className = "bubble them live";
      wrap.innerHTML = html + `<span class="time">${nowTime()}</span>`;
    } else if (type === "flow") {
      wrap.className = "flow-card live";
      wrap.innerHTML = html;
    } else if (type === "list") {
      wrap.className = "list-bubble live";
      wrap.innerHTML = html;
    }
    return wrap;
  }

  function typingNode() {
    const n = document.createElement("div");
    n.className = "typing-indicator live";
    Object.assign(n.style, {
      alignSelf: "flex-start",
      background: "var(--chat-bubble-them)",
      borderRadius: "10px",
      borderTopLeftRadius: "2px",
      padding: "8px 12px",
      display: "inline-flex",
      gap: "4px",
    });
    n.innerHTML =
      '<span style="width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,0.55);animation:typing-bounce 1s infinite;"></span>' +
      '<span style="width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,0.55);animation:typing-bounce 1s infinite;animation-delay:.15s;"></span>' +
      '<span style="width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,0.55);animation:typing-bounce 1s infinite;animation-delay:.30s;"></span>';
    return n;
  }

  function scrollChat(body) {
    body.scrollTop = body.scrollHeight;
  }

  function delay(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  let isPlaying = false;

  async function playScenario(scenarioKey, body) {
    if (isPlaying) return;
    isPlaying = true;
    const sc = SCENARIOS[scenarioKey];
    if (!sc) {
      isPlaying = false;
      return;
    }

    // 1. user message
    const userBubble = mkBubble("user", sc.userText);
    body.appendChild(userBubble);
    scrollChat(body);
    await delay(500);

    // 2. each bot step: typing → reveal
    for (const step of sc.steps) {
      const typing = typingNode();
      body.appendChild(typing);
      scrollChat(body);
      await delay(700 + Math.random() * 400);
      typing.remove();
      const node = mkBubble(step.type, step.html);
      body.appendChild(node);
      scrollChat(body);
      await delay(700);
    }

    isPlaying = false;
  }

  function setup() {
    const phone = document.getElementById("cover-phone");
    if (!phone) return;
    const body = document.getElementById("cover-chat-body");
    const chips = document.querySelectorAll("#cover-chips .chip");

    chips.forEach((chip) => {
      chip.addEventListener("click", async () => {
        if (isPlaying) return;
        const key = chip.dataset.scenario;
        chip.classList.add("used");
        await playScenario(key, body);
      });
    });

    // Auto-play the first scenario after a short delay, but only when slide active
    const deck = document.querySelector("deck-stage");
    let autoPlayed = false;
    const tryAutoPlay = (slideEl) => {
      if (autoPlayed) return;
      if (slideEl && slideEl.contains(phone)) {
        autoPlayed = true;
        setTimeout(() => {
          const firstChip = document.querySelector('#cover-chips .chip[data-scenario="pix"]');
          if (firstChip && !isPlaying) {
            firstChip.classList.add("used");
            playScenario("pix", body);
          }
        }, 900);
      }
    };
    if (deck) {
      deck.addEventListener("slidechange", (e) => tryAutoPlay(e.detail && e.detail.slide));
      // also try on init
      const initTry = (n) => {
        const active = deck.querySelector('section[data-deck-active]');
        if (active) tryAutoPlay(active);
        else if (n < 30) setTimeout(() => initTry(n + 1), 100);
      };
      initTry(0);
    } else {
      tryAutoPlay(document.querySelector("#s1"));
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setup);
  } else {
    setup();
  }
})();
