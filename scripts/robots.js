/** robots.js — stars + 2 marching bots + customizable static bot sizes **/

const STAR_COUNT = 90;

// Customize which bots move and which are static
const MOVING_ROBOTS = [
  { file: "robot2.png", size: 500 },
  
];

const STATIC_OBJECTS = [
  { file: "robot3.png", size: 1500, position: "12vw" },  // left side
  { file: "robot1.png", size: 700, position: "85vw" },   // right side
  { file: "shield.svg", size: 110, position: "25vw" },   // somewhere in between
];


/* ⭐ Generate stars */
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

/* 🤖 Create moving robots (only one of each) */
MOVING_ROBOTS.forEach((bot, i) => {
  const r = document.createElement("img");
  r.src = `assets/${bot.file}`;
  r.className = "robot";

  r.style.height = `${bot.size}px`;                        // ✅ custom size
  r.style.left = `${rand(-10, 90)}vw`;
  r.style.setProperty("--dur", `${rand(30, 45)}s`);
  r.style.setProperty("--delay", `${i * 4}s`);
  document.body.appendChild(r);
});

/* 🚧 Create static robots (only one of each) */
STATIC_OBJECTS.forEach((obj) => {
  const img = document.createElement("img");
  img.src = `assets/${obj.file}`;
  img.className = "static-bot";

  img.style.height = `${obj.size}px`;
  img.style.left   = obj.position || "50vw";  // if position not given, default to center
  img.style.bottom = "8vh";

  document.body.appendChild(img);
});


/* 🔧 Utilities */
function rand(min, max) {
  return Math.random() * (max - min) + min;
}





