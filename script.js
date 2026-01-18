(() => {
  const mouse = document.getElementById("mouse");
  const success = document.getElementById("success");
  const circle = document.getElementById("hold-circle");

  const FLEE_RADIUS = 160;
  const FLEE_FORCE = 14;

  const HOLD_TIME_MS = 5000; // ⏱️ 5 secondes
  const RESTART_MS = 1500;

  let vw = window.innerWidth;
  let vh = window.innerHeight;

  let pos = { x: vw / 2, y: vh / 2 };
  let cursor = { x: vw / 2, y: vh / 2 };

  let rightDown = false;
  let holdStart = null;
  let won = false;

  placeMouse();

  window.addEventListener("resize", () => {
    vw = window.innerWidth;
    vh = window.innerHeight;
  });

  // Mouvement souris PC
  window.addEventListener("mousemove", e => {
    cursor.x = e.clientX;
    cursor.y = e.clientY;

    circle.style.left = cursor.x + "px";
    circle.style.top = cursor.y + "px";

    if (!won) update();
  });

  // Bloque menu clic droit
  window.addEventListener("contextmenu", e => e.preventDefault());

  // Clic droit DOWN
  window.addEventListener("mousedown", e => {
    if (e.button === 2 && !won) {
      rightDown = true;
      holdStart = performance.now(); // 🔥 DÉMARRE ICI ET SEULEMENT ICI
      circle.classList.add("active");
    }
  });

  // Clic droit UP
  window.addEventListener("mouseup", e => {
    if (e.button === 2) {
      rightDown = false;
      holdStart = null;
      circle.classList.remove("active");
    }
  });

  function update() {
    // Souris emoji fuit
    const dx = pos.x - cursor.x;
    const dy = pos.y - cursor.y;
    const dist = Math.hypot(dx, dy);

    if (dist < FLEE_RADIUS) {
      pos.x += (dx / dist) * FLEE_FORCE + rand();
      pos.y += (dy / dist) * FLEE_FORCE + rand();
      clamp();
      placeMouse();
    }

    // Condition SECRÈTE : maintien clic droit 5s
    if (rightDown && holdStart !== null) {
      const held = performance.now() - holdStart;
      if (held >= HOLD_TIME_MS) win();
    }
  }

  function win() {
    if (won) return;
    won = true;
    success.hidden = false;
    circle.classList.remove("active");

    setTimeout(() => {
      location.reload();
    }, RESTART_MS);
  }

  function placeMouse() {
    mouse.style.left = pos.x + "px";
    mouse.style.top = pos.y + "px";
    mouse.style.transform = "translate(-50%, -50%)";
  }

  function clamp() {
    pos.x = Math.max(20, Math.min(vw - 20, pos.x));
    pos.y = Math.max(20, Math.min(vh - 20, pos.y));
  }

  function rand() {
    return (Math.random() - 0.5) * 4;
  }
})();
