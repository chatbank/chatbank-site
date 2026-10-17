/**
 * Eventos do deck comercial no PostHog.
 * O snippet oficial em index.html já faz pageview + autocapture;
 * daqui saem jornada de slides, capa interativa e CTAs de fechamento.
 */
(function () {
  function capture(event, props) {
    try {
      if (window.posthog && typeof window.posthog.capture === "function") {
        window.posthog.capture(event, props);
      }
    } catch (_) {}
  }

  function slideMeta(slide) {
    if (!slide) return { slide_label: "", slide_id: "" };
    return {
      slide_label: slide.getAttribute("data-screen-label") || slide.getAttribute("data-label") || "",
      slide_id: slide.id || "",
    };
  }

  function bindDeck() {
    const deck = document.querySelector("deck-stage");
    if (!deck) return;

    deck.addEventListener("slidechange", (e) => {
      const d = e.detail || {};
      const meta = slideMeta(d.slide);
      capture("slide_viewed", Object.assign({}, meta, {
        slide_index: d.index,
        slide_total: d.total,
        previous_index: d.previousIndex,
        reason: d.reason || "",
      }));

      if (typeof d.index === "number" && typeof d.total === "number" && d.total > 0 && d.index === d.total - 1) {
        capture("deck_completed", Object.assign({}, meta, {
          slide_index: d.index,
          slide_total: d.total,
          reason: d.reason || "",
        }));
      }
    });
  }

  function bindCoverChips() {
    document.addEventListener("click", (e) => {
      const chip = e.target.closest && e.target.closest("#cover-chips .chip");
      if (!chip) return;
      capture("cover_chip_clicked", {
        scenario: chip.dataset.scenario || "",
        label: (chip.textContent || "").trim(),
      });
    }, true);
  }

  function bindCtas() {
    document.addEventListener("click", (e) => {
      const el = e.target.closest && e.target.closest("[data-cta]");
      if (!el) return;
      capture("cta_contact_click", {
        cta: el.getAttribute("data-cta") || "",
        label: (el.textContent || "").replace(/\s+/g, " ").trim(),
        href: el.getAttribute("href") || "",
      });
    }, true);
  }

  function bindOutbound() {
    document.addEventListener("click", (e) => {
      const el = e.target.closest && e.target.closest("[data-outbound]");
      if (!el) return;
      capture("outbound_click", {
        destination: el.getAttribute("data-outbound") || "",
        label: (el.textContent || "").replace(/\s+/g, " ").trim(),
        href: el.getAttribute("href") || "",
      });
    }, true);
  }

  function start() {
    bindDeck();
    bindCoverChips();
    bindCtas();
    bindOutbound();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
