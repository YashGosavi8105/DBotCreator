const STAR_COUNT = 100;

// Moving robots with responsive sizes
const MOVING_ROBOTS = [
  { file: "robot2.png", size: "clamp(550px, 12vw, 160px)" },
  //{ file: "robot2.svg", size: "clamp(70px, 10vw, 130px)" },
];

// Static bots with position and responsive size
const STATIC_OBJECTS = [
  { file: "robot3.png", size: "clamp(1500px, 8vw, 100px)", position: "10vw" },
  { file: "robot1.png",  size: "clamp(800px, 10vw, 130px)", position: "88vw" },
  //{ file: "shield.svg",  size: "clamp(50px, 7vw, 90px)",   position: "22vw" }
];

/* ⭐ Stars */
for (let i = 0; i < STAR_COUNT; i++) {
  const s = document.createElement("div");
  s.className = "star";
  const sz = rand(1, 2.5);
  s.style.width  = `${sz}px`;
  s.style.height = `${sz}px`;
  s.style.left   = `${rand(0, 100)}vw`;
  s.style.top    = `${rand(0, 100)}vh`;
  s.style.animationDelay = `${rand(0, 3)}s`;
  document.body.appendChild(s);
}

/* 🤖 Moving robots */
MOVING_ROBOTS.forEach((bot, i) => {
  const r = document.createElement("img");
  r.src = `assets/${bot.file}`;
  r.className = "robot";

  r.style.height = bot.size;
  r.style.left = `${rand(-10, 90)}vw`;
  r.style.setProperty("--dur", `${rand(30, 45)}s`);
  r.style.setProperty("--delay", `${i * 4}s`);
  document.body.appendChild(r);
});

/* 🧍‍♂️ Static bots */
STATIC_OBJECTS.forEach((obj) => {
  const img = document.createElement("img");
  img.src = `assets/${obj.file}`;
  img.className = "static-bot";

  img.style.height = obj.size;
  img.style.left   = obj.position || "50vw";
  img.style.bottom = "8vh";

  document.body.appendChild(img);
});

/* 🛠 Helpers */
function rand(min, max) {
  return Math.random() * (max - min) + min;
}






