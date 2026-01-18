(() => {
  const mouseEl = document.getElementById("mouse");
  const successEl = document.getElementById("success");

  // Réglages gameplay
  const FLEE_RADIUS = 140;      // distance à laquelle la souris commence à fuir
  const FLEE_STRENGTH = 210;    // puissance de fuite (px)
  const EDGE_PADDING = 24;      // marge pour éviter les bords
  const HOLD_TO_WIN_MS = 1400;  // temps à maintenir clic gauche "sur" la souris

  let vw = window.innerWidth;
  let vh = window.innerHeight;

  let pos = { x: vw * 0.5, y: vh * 0.55 };
  let cursor = { x: vw * 0.2, y: vh * 0.2 };

  let isLeftDown = false;
  let isWon = false;
  let holdStart = null;

  // Place initiale
  placeMouse(pos.x, pos.y);

  window.addEventListener("resize", () => {
    vw = window.innerWidth;
    vh = window.innerHeight;
    pos.x = clamp(pos.x, EDGE_PADDING, vw - EDGE_PADDING);
    pos.y = clamp(pos.y, EDGE_PADDING, vh - EDGE_PADDING);
    placeMouse(pos.x, pos.y);
  });

  // Track souris du PC
  window.addEventListener("mousemove", (e) => {
    cursor.x = e.clientX;
    cursor.y = e.clientY;
    if (!isWon) update();
  });

  // Track clic gauche
  window.addEventListener("mousedown", (e) => {
    if (e.button === 0) isLeftDown = true;
  });
  window.addEventListener("mouseup", (e) => {
    if (e.button === 0) {
      isLeftDown = false;
      holdStart = null; // reset si on relâche
    }
  });

  // Empêche le drag image / selection
  mouseEl.addEventListener("dragstart", (e) => e.preventDefault());

  function update() {
    // distance curseur → emoji
    const dx = pos.x - cursor.x;
    const dy = pos.y - cursor.y;
    const dist = Math.hypot(dx, dy);

    // La souris fuit si curseur proche
    if (dist < FLEE_RADIUS) {
      // direction de fuite (loin du curseur)
      const ux = dx / (dist || 1);
      const uy = dy / (dist || 1);

      // petit random pour éviter un pattern trop "robot"
      const jitter = 0.35;
      const rx = (Math.random() - 0.5) * jitter;
      const ry = (Math.random() - 0.5) * jitter;

      pos.x += (ux + rx) * (FLEE_STRENGTH * (1 - dist / FLEE_RADIUS)) * 0.08;
      pos.y += (uy + ry) * (FLEE_STRENGTH * (1 - dist / FLEE_RADIUS)) * 0.08;

      // clamp dans l’écran
      pos.x = clamp(pos.x, EDGE_PADDING, vw - EDGE_PADDING);
      pos.y = clamp(pos.y, EDGE_PADDING, vh - EDGE_PADDING);

      placeMouse(pos.x, pos.y);
    }

    // Condition victoire :
    // - clic gauche maintenu
    // - curseur très proche de l’emoji (zone "attrapé")
    const CAPTURE_RADIUS = 38;
    const isCapturing = isLeftDown && dist < CAPTURE_RADIUS;

    if (isCapturing) {
      if (holdStart === null) holdStart = performance.now();
      const held = performance.now() - holdStart;

      if (held >= HOLD_TO_WIN_MS) {
        win();
      }
    } else {
      holdStart = null;
    }
  }

  function win() {
    isWon = true;
    successEl.hidden = false;
    // Freeze la souris (elle arrête de fuir, la lâche pas, c’est fini 😈)
    mouseEl.style.transform = "translate(-50%, -50%) scale(1.15)";
  }

  function placeMouse(x, y) {
    mouseEl.style.left = `${x}px`;
    mouseEl.style.top = `${y}px`;
  }

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }
})();
