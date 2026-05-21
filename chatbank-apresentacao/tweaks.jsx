/* global React, ReactDOM */
const { useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": ["#ff7a6c", "#f04f7c", "#c84db5"],
  "showFooters": true,
  "showSlideMeta": true
}/*EDITMODE-END*/;

const PALETTES = [
  ["#ff7a6c", "#f04f7c", "#c84db5"], // coral → magenta (default, matches references)
  ["#2ee6a0", "#1fb573", "#0a8d62"], // verde
  ["#00e0d6", "#11b5c3", "#1a8fb1"], // ciano
  ["#ffcc4d", "#ff9b3a", "#ff6a3a"], // amber
  ["#7da8ff", "#6470ff", "#5a3df0"]  // azul-violeta
];

function applyPalette(p) {
  const root = document.documentElement;
  root.style.setProperty("--accent-1", p[0]);
  root.style.setProperty("--accent-2", p[1]);
  root.style.setProperty("--accent-3", p[2]);
  root.style.setProperty("--accent-solid", p[1]);
  root.style.setProperty("--accent-grad",
    `linear-gradient(95deg, ${p[0]} 0%, ${p[1]} 55%, ${p[2]} 100%)`);
}

function applyChrome(showFooters, showSlideMeta) {
  document.querySelectorAll(".slide-foot").forEach(el => {
    el.style.display = showFooters ? "" : "none";
  });
  document.querySelectorAll(".slide-meta").forEach(el => {
    el.style.display = showSlideMeta ? "" : "none";
  });
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  useEffect(() => { applyPalette(t.palette); }, [t.palette]);
  useEffect(() => { applyChrome(t.showFooters, t.showSlideMeta); }, [t.showFooters, t.showSlideMeta]);

  return (
    <TweaksPanel>
      <TweakSection title="Paleta de acento">
        <TweakColor
          label="Cor do acento"
          value={t.palette}
          options={PALETTES}
          onChange={(v) => setTweak("palette", v)}
        />
      </TweakSection>

      <TweakSection title="Chrome dos slides">
        <TweakToggle
          label="Mostrar rodapé"
          value={t.showFooters}
          onChange={(v) => setTweak("showFooters", v)}
        />
        <TweakToggle
          label="Mostrar header dos slides"
          value={t.showSlideMeta}
          onChange={(v) => setTweak("showSlideMeta", v)}
        />
      </TweakSection>
    </TweaksPanel>
  );
}

const root = ReactDOM.createRoot(document.getElementById("tweaks-root"));
root.render(<App />);
