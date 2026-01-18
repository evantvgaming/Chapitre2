(() => {
  const mouseEl = document.getElementById("mouse");
  const successEl = document.getElementById("success");

  // Gameplay (piège)
  const FLEE_RADIUS = 160;
  const FLEE_STRENGTH = 260;
  const EDGE_PADDING = 24;

  // Vraie condition de fin (secret) : maintenir clic droit
  const HOLD_RIGHT_TO_WIN_MS = 1400;

  // Après "Bravo Leandro", le site recommence
  const RESTART_AFTER_MS = 1200;

  let vw = window.innerWidth;
  let vh = window.innerHeight;

  let pos = { x: vw * 0.5, y: vh * 0.55 };
  let cursor = { x: vw * 0.2, y: vh * 0.2 };

  let isRightDown = false;
  let isWon = false;
  let rightHoldStart = null;

  placeMouse(pos.x, pos.y);

  window.addEventListener("resize", () => {
    vw = window.innerWidth;
    vh = window.innerHeight;
    pos.x = clamp(pos.x, EDGE_PADDING, vw - EDGE_PADDING);
    pos.y = clamp(pos.y, EDGE_PADDING, vh - EDGE_PADDING);
    placeMouse(pos.x, pos.y);
  });

  // Déplacement du curseur
  window.addEventListener("mousemove", (e) => {
    cursor.x = e.clientX;
    cursor.y = e.clientY;
    if (!isWon) update();
  });

  // IMPORTANT : empêcher le menu contextuel du clic droit (sinon ça casse le jeu)
  window.addEventListener("contextmenu", (e) => e.preventDefault());

  // Track clic droit
  window.addEventListener("mousedown", (e) => {
    if (e.button === 2) {
      isRightDown = true;
      if (rightHoldStart === null) rightHoldStart = performance.now();
    }
  });

  window.addEventListener("mouseup", (e) => {
    if (e.button === 2) {
      isRightDown = false;
      rightHoldStart = null;
    }
  });

  mouseEl.addEventListener("dragstart", (e) => e.preventDefault());

  function update() {
    // La souris fuit le curseur (et reste "inattrapable" naturellement)
    const dx = pos.x - cursor.x;
    const dy = pos.y - cursor.y;
    const dist = Math.hypot(dx, dy);

    if (dist < FLEE_RADIUS) {
      const ux = dx / (dist || 1);
      const uy = dy / (dist || 1);

      // jitter pour qu’elle ait l’air “vivante”
      const jitter = 0.45;
      const rx = (Math.random() - 0.5) * jitter;
      const ry = (Math.random() - 0.5) * jitter;

      const push = (FLEE_STRENGTH * (1 - dist / FLEE_RADIUS)) * 0.085;

      pos.x += (ux + rx) * push;
      pos.y += (uy + ry) * push;

      pos.x = clamp(pos.x, EDGE_PADDING, vw - EDGE_PADDING);
      pos.y = clamp(pos.y, EDGE_PADDING, vh - EDGE_PADDING);

      placeMouse(pos.x, pos.y);
    }

    // Condition secrète : maintien clic droit (n'importe où à l'écran)
    if (isRightDown && rightHoldStart !== null) {
      const held = performance.now() - rightHoldStart;
      if (held >= HOLD_RIGHT_TO_WIN_MS) win();
    }
  }

  // Si le joueur ne bouge plus la souris, on continue quand même à vérifier le hold
  // via une boucle légère.
  function tick() {
    if (!isWon) {
      if (isRightDown && rightHoldStart !== null) {
        const held = performance.now() - rightHoldStart;
        if (held >= HOLD_RIGHT_TO_WIN_MS) win();
      }
      requestAnimationFrame(tick);
    }
  }
  tick();

  function win() {
    if (isWon) return;
    isWon = true;

    successEl.hidden = false;
    mouseEl.style.filter = "grayscale(1) drop-shadow(0 10px 18px rgba(0,0,0,.6))";
    mouseEl.style.transform = "translate(-50%, -50%) scale(0.9)";

    // restart automatique
    setTimeout(() => {
      window.location.reload();
    }, RESTART_AFTER_MS);
  }

  function placeMouse(x, y) {
    mouseEl.style.left = `${x}px`;
    mouseEl.style.top = `${y}px`;
  }

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }
})();

