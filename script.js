(() => {
  const mouse = document.getElementById("mouse");
  const success = document.getElementById("success");

  const FLEE_RADIUS = 160;
  const FLEE_FORCE = 14;
  const HOLD_RIGHT_MS = 1500;
  const RESTART_MS = 1200;

  let vw = window.innerWidth;
  let vh = window.innerHeight;

  let pos = { x: vw / 2, y: vh / 2 };
  let cursor = { x: 0, y: 0 };

  let rightDown = false;
  let rightStart = null;
  let won = false;

  let rage = 0;

  place();

  window.addEventListener("resize", () => {
    vw = window.innerWidth;
    vh = window.innerHeight;
  });

  window.addEventListener("mousemove", e => {
    cursor.x = e.clientX;
    cursor.y = e.clientY;
    if (!won) update();
  });

  // Anti menu clic droit
  window.addEventListener("contextmenu", e => e.preventDefault());

  window.addEventListener("mousedown", e => {
    if (e.button === 2 && !won) {
      rightDown = true;
      rightStart = performance.now();
    }
  });

  window.addEventListener("mouseup", e => {
    if (e.button === 2) {
      rightDown = false;
      rightStart = null;
    }
  });

  function update() {
    const dx = pos.x - cursor.x;
    const dy = pos.y - cursor.y;
    const dist = Math.hypot(dx, dy);

    if (dist < FLEE_RADIUS) {
      rage++;
      if (rage > 5) mouse.classList.add("glitch");

      pos.x += (dx / dist) * FLEE_FORCE + rand();
      pos.y += (dy / dist) * FLEE_FORCE + rand();

      clamp();
      place();
    } else {
      rage = Math.max(0, rage - 1);
      mouse.classList.remove("glitch");
    }

    if (rightDown && rightStart) {
      if (performance.now() - rightStart >= HOLD_RIGHT_MS) win();
    }
  }

  function win() {
    if (won) return;
    won = true;
    success.hidden = false;

    setTimeout(() => {
      location.reload();
    }, RESTART_MS);
  }

  function place() {
    mouse.style.left = pos.x + "px";
    mouse.style.top = pos.y + "px";
    mouse.style.transform = "translate(-50%, -50%)";
  }

  function clamp() {
    pos.x = Math.max(20, Math.min(vw - 20, pos.x));
    pos.y = Math.max(20, Math.min(vh - 20, pos.y));
  }

  function rand() {
    return (Math.random() - 0.5) * rage;
  }
})();
