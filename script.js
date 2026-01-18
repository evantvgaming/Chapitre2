(() => {
  const mouse = document.getElementById("mouse");
  const circle = document.getElementById("hold-circle");

  const FLEE_RADIUS = 160;
  const FLEE_FORCE = 14;

  let vw = window.innerWidth;
  let vh = window.innerHeight;

  let pos = { x: vw / 2, y: vh / 2 };
  let cursor = { x: vw / 2, y: vh / 2 };

  let rightDown = false;

  placeMouse();

  window.addEventListener("resize", () => {
    vw = window.innerWidth;
    vh = window.innerHeight;
  });

  window.addEventListener("mousemove", (e) => {
    cursor.x = e.clientX;
    cursor.y = e.clientY;

    // le rond suit le curseur
    circle.style.left = cursor.x + "px";
    circle.style.top = cursor.y + "px";

    update();
  });

  // Empêche le menu clic droit
  window.addEventListener("contextmenu", (e) => e.preventDefault());

  window.addEventListener("mousedown", (e) => {
    if (e.button === 2) {
      rightDown = true;
      circle.classList.add("active"); // ✅ rond visible
    }
  });

  window.addEventListener("mouseup", (e) => {
    if (e.button === 2) {
      rightDown = false;
      circle.classList.remove("active"); // ✅ rond disparaît
    }
  });

  function update() {
    // Souris emoji fuit le curseur (piège)
    const dx = pos.x - cursor.x;
    const dy = pos.y - cursor.y;
    const dist = Math.hypot(dx, dy);

    if (dist < FLEE_RADIUS) {
      pos.x += (dx / (dist || 1)) * FLEE_FORCE + rand();
      pos.y += (dy / (dist || 1)) * FLEE_FORCE + rand();
      clamp();
      placeMouse();
    }

    // ✅ volontairement : PAS DE BRAVO, PAS DE FIN
    // rightDown sert juste à afficher le rond blanc.
    void rightDown;
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
