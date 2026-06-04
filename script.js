// GOD'S OWN TRAILS – floating squares + slow falling leaf background (updated)

function initNatureTilesAndLeaves() {
  const canvas = document.getElementById("particle-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  let width = window.innerWidth;
  let height = window.innerHeight;

  const SQUARE_COUNT = 26;
  const LEAF_COUNT = 26;

  class Square {
    constructor(initial = false) { this.reset(initial); }

    reset(initial = false) {
      this.size = 18 + Math.random() * 30;
      this.x = initial ? Math.random() * width : (Math.random() < 0.5 ? -100 : width + 100);
      this.y = initial ? Math.random() * height : Math.random() * height;

      this.speed = 0.08 + Math.random() * 0.14;
      this.angle = Math.random() * Math.PI * 2;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.002;

      this.drift = 0.02 + Math.random() * 0.03;

      const baseAlpha = 0.16 + Math.random() * 0.12;
      this.fill = `rgba(220, 245, 230, ${baseAlpha})`;
      this.border = "rgba(15, 90, 83, 0.22)";
      this.roundness = 6 + Math.random() * 8;
    }

    update(delta) {
      const t = delta / 16;
      this.angle += (Math.random() - 0.5) * 0.01;
      this.x += Math.cos(this.angle) * this.speed * 30 * t;
      this.y += (Math.sin(this.angle) * this.speed * 18 + 0.04 * 16 * t);
      this.rotation += this.rotationSpeed * t;

      if (this.x < -140 || this.x > width + 140 || this.y < -140 || this.y > height + 140) this.reset();
    }

    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);

      ctx.shadowColor = "rgba(5, 35, 25, 0.22)";
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 3;

      roundedRect(ctx, -this.size / 2, -this.size / 2, this.size, this.size, this.roundness);

      ctx.fillStyle = this.fill;
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = this.border;
      ctx.stroke();

      ctx.restore();
    }
  }

  class Leaf {
    constructor(initial = false) { this.reset(initial); }

    reset(initial = false) {
      this.length = 24 + Math.random() * 34;
      this.width = this.length * (0.35 + Math.random() * 0.25);

      this.x = initial ? Math.random() * width : Math.random() * width;
      this.y = initial ? Math.random() * height : -60 - Math.random() * 80;

      //  UPDATED: SLOW fall speed
      this.fallSpeed = 0.02 + Math.random() * 0.035;   // much slower falling
      this.swaySpeed = 0.0008 + Math.random() * 0.001; // slower side sway

      this.swayAmount = 6 + Math.random() * 10;

      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.002;

      this.phase = Math.random() * Math.PI * 2;

      const tone = Math.random();
      if (tone < 0.4) {
        this.color1 = "rgba(180, 230, 190, 0.9)";
        this.color2 = "rgba(90, 160, 120, 0.95)";
      } else if (tone < 0.8) {
        this.color1 = "rgba(195, 240, 205, 0.9)";
        this.color2 = "rgba(100, 175, 130, 0.95)";
      } else {
        this.color1 = "rgba(210, 245, 210, 0.9)";
        this.color2 = "rgba(120, 185, 140, 0.95)";
      }

      this.stemColor = "rgba(60, 120, 80, 0.8)";
    }

    update(delta) {
      const t = delta / 16;
      this.phase += this.swaySpeed * delta;
      const sway = Math.sin(this.phase) * this.swayAmount;

      this.y += this.fallSpeed * 25 * t;
      this.x += sway * 0.02 * t * 16;

      this.rotation += this.rotationSpeed * t;

      if (this.y > height + 100) this.reset();
    }

    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);

      const grad = ctx.createLinearGradient(0, -this.length / 2, 0, this.length / 2);
      grad.addColorStop(0, this.color1);
      grad.addColorStop(1, this.color2);

      ctx.fillStyle = grad;
      ctx.strokeStyle = "rgba(30, 90, 60, 0.6)";
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.moveTo(0, -this.length / 2);
      ctx.quadraticCurveTo(this.width / 2, -this.length / 4, this.width / 2, 0);
      ctx.quadraticCurveTo(this.width / 2, this.length / 4, 0, this.length / 2);
      ctx.quadraticCurveTo(-this.width / 2, this.length / 4, -this.width / 2, 0);
      ctx.quadraticCurveTo(-this.width / 2, -this.length / 4, 0, -this.length / 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.strokeStyle = this.stemColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, -this.length / 2 + 3);
      ctx.lineTo(0, this.length / 2 - 3);
      ctx.stroke();

      ctx.restore();
    }
  }

  function roundedRect(ctx, x, y, w, h, r) {
    const radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  let squares = [];
  let leaves = [];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;

    squares = [];
    leaves = [];

    for (let i = 0; i < SQUARE_COUNT; i++) squares.push(new Square(true));
    for (let i = 0; i < LEAF_COUNT; i++) leaves.push(new Leaf(true));
  }

  window.addEventListener("resize", resize);
  resize();

  let lastTime = performance.now();

  function draw(now) {
    const delta = now - lastTime;
    lastTime = now;

    ctx.clearRect(0, 0, width, height);

    const mist = ctx.createLinearGradient(0, 0, 0, height);
    mist.addColorStop(0, "rgba(230, 246, 234, 0.22)");
    mist.addColorStop(1, "rgba(230, 246, 234, 0.04)");
    ctx.fillStyle = mist;
    ctx.fillRect(0, 0, width, height);

    for (const s of squares) {
      s.update(delta);
      s.draw(ctx);
    }

    for (const l of leaves) {
      l.update(delta);
      l.draw(ctx);
    }

    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
}

document.addEventListener("DOMContentLoaded", initNatureTilesAndLeaves);
