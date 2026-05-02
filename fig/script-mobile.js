document.addEventListener("DOMContentLoaded", () => {
    // =========================
    // CANVAS SETUP
    // =========================
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
  
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.zIndex = "0";
    canvas.style.pointerEvents = "none";
  
    document.body.appendChild(canvas);
  
    const imagesSrc = [
      "cursor.svg",
      "cursor2.svg",
      "cursor3.svg",
      "cursor4.svg"
    ];
  
    const images = [];
    let loaded = 0;
  
    const stamps = [];
  
    // =========================
    // CURSOR STATE (ghost tool)
    // =========================
    const cursor = {
      x: 0,
      y: 0,
      index: 0,
      rotation: 0,
      visible: false
    };
  
    // =========================
    // LOAD IMAGES
    // =========================
    imagesSrc.forEach((src, i) => {
      const img = new Image();
      img.src = src;
  
      img.onload = () => {
        loaded++;
        if (loaded === imagesSrc.length) init();
      };
  
      images[i] = img;
    });
  
    // =========================
    // HELPERS
    // =========================
    function getDocHeight() {
      return Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      );
    }
  
    function resizeCanvas() {
      const dpr = window.devicePixelRatio || 1;
  
      const width = window.innerWidth;
      const height = getDocHeight();
  
      canvas.width = width * dpr;
      canvas.height = height * dpr;
  
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
  
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  
    function getDrawSize(img, size) {
      const aspect = img.width / img.height;
  
      let w, h;
  
      if (aspect > 1) {
        w = size;
        h = size / aspect;
      } else {
        h = size;
        w = size * aspect;
      }
  
      return { w, h };
    }
  
    // =========================
    // DRAW STAMP
    // =========================
    function drawStamp(stamp) {
      const img = images[stamp.index];
  
      const { w, h } = getDrawSize(img, 400);
  
      ctx.save();
      ctx.translate(stamp.x, stamp.y);
      ctx.rotate(stamp.rotation);
  
      ctx.drawImage(img, -w / 2, -h / 2, w, h);
  
      ctx.restore();
    }
  
    // =========================
    // GHOST CURSOR PREVIEW
    // =========================
    function drawCursorPreview() {
      if (!cursor.visible) return;
  
      const img = images[cursor.index];
  
      const { w, h } = getDrawSize(img, 400);
  
      ctx.save();
      ctx.globalAlpha = 0.35;
  
      ctx.translate(cursor.x, cursor.y);
      ctx.rotate(cursor.rotation);
  
      ctx.drawImage(img, -w / 2, -h / 2, w, h);
  
      ctx.restore();
    }
  
    // =========================
    // REDRAW
    // =========================
    function redrawAll() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      for (const stamp of stamps) {
        drawStamp(stamp);
      }
  
      drawCursorPreview();
    }
  
    // =========================
    // ADD STAMP
    // =========================
    function addStamp(x, y) {
      const stamp = {
        x,
        y,
        index: Math.floor(Math.random() * images.length),
        rotation: Math.random() * Math.PI * 2
      };
  
      stamps.push(stamp);
  
      // draw only new stamp (fast path)
      drawStamp(stamp);
      drawCursorPreview();
    }
  
    // =========================
    // INIT
    // =========================
    function init() {
      resizeCanvas();
      redrawAll();
  
      const isTouch = window.matchMedia("(pointer: coarse)").matches;
  
      // =========================
      // DESKTOP CURSOR TRACKING
      // =========================
      if (!isTouch) {
        cursor.visible = true;
  
        document.addEventListener("mousemove", (e) => {
          cursor.x = e.clientX;
          cursor.y = e.clientY + window.scrollY;
        });
      }
  
      // =========================
      // INPUT (CLICK / TAP)
      // =========================
      document.addEventListener("pointerdown", (e) => {
        const x = e.clientX;
        const y = e.clientY + window.scrollY;
  
        addStamp(x, y);
  
        // change cursor after each click (desktop feel)
        cursor.index = Math.floor(Math.random() * images.length);
        cursor.rotation = Math.random() * Math.PI * 2;
      });
  
      // =========================
      // KEEP CANVAS IN SYNC WITH PAGE HEIGHT
      // =========================
      const observer = new ResizeObserver(() => {
        resizeCanvas();
        redrawAll();
      });
  
      observer.observe(document.body);
  
      window.addEventListener("resize", () => {
        resizeCanvas();
        redrawAll();
      });
    }
  });
//   
// 
// 

  


  document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const imagesSrc = [
    "cursor.svg",
    "cursor2.svg",
    "cursor3.svg",
    "cursor4.svg"
  ];

  const images = [];
  let loaded = 0;

  // preload SVGs as images
  imagesSrc.forEach((src, i) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      loaded++;
      if (loaded === imagesSrc.length) init();
    };
    images.push(img);
  });

  let currentImage = 0;
  let currentRotation = Math.random() * 360;

  function init() {
    document.addEventListener("click", (e) => {
      const img = images[currentImage];

      const x = e.clientX;
      const y = e.clientY;

      ctx.save();

      ctx.translate(x, y);
      ctx.rotate((currentRotation * Math.PI) / 180);

      ctx.drawImage(
        img,
        -img.width / 2,
        -img.height / 2
      );

      ctx.restore();

      // pick next
      let next;
      do {
        next = Math.floor(Math.random() * images.length);
      } while (images.length > 1 && next === currentImage);

      currentImage = next;
      currentRotation = Math.random() * 360;
    });
  }
});

//   CANVAS INTO SECTION
  const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');

        let WIDTH = 0;
        let HEIGHT = 0;
        let mouseX = 0;
        let mouseY = 0;

        const CONFIG = {
            bandHeight: 45,
            stripeWidth: 70,
            stepSize: 26,              // same sharp steps for both axes
            shearX: 480,               // horizontal strength
            shearY: 240,               // vertical strength — increased for clear effect
            wave: 55,
            minWidth: 230,
            edgeJitter: 17
        };

        function resize() {
            WIDTH = window.innerWidth;
            HEIGHT = window.innerHeight;
            canvas.width = WIDTH;
            canvas.height = HEIGHT;
        }

        function getOffsets(baseY) {
            const normX = (mouseX / WIDTH) * 2 - 1;
            const normY = (mouseY / HEIGHT) * 2 - 1;

            // Horizontal shift (reacts mainly to mouse X)
            let offsetX = normX * CONFIG.shearX * (baseY / HEIGHT);
            offsetX += Math.sin(baseY * 0.01) * CONFIG.wave;
            offsetX += (mouseX - WIDTH * 0.5) * 0.1;

            // Vertical shift (reacts mainly to mouse Y) — this is the key fix
            let offsetY = normY * CONFIG.shearY * ((baseY / HEIGHT) - 0.5) * 2.2;
            offsetY += (mouseY - baseY) * 0.25;   // strong pull toward cursor Y

            // Quantize both for the blocky staircase look
            offsetX = Math.round(offsetX / CONFIG.stepSize) * CONFIG.stepSize;
            offsetY = Math.round(offsetY / CONFIG.stepSize) * CONFIG.stepSize;

            return { offsetX, offsetY };
        }

        function draw() {
    
            // ctx.fillRect(0, 0, WIDTH, HEIGHT);

            const numBands = Math.ceil(HEIGHT / CONFIG.bandHeight) + 6;

            for (let i = 0; i < numBands; i++) {
                const baseY = i * CONFIG.bandHeight - CONFIG.bandHeight * 0.25;

                const { offsetX, offsetY } = getOffsets(baseY);

                const y = baseY + offsetY;

                if (y > HEIGHT + 100 || y + CONFIG.bandHeight < -80) continue;

                let leftX = 25 + offsetX;

                const normX = (mouseX / WIDTH) * 2 - 1;
                let width = WIDTH - 70 + normX * 160;
                width = Math.max(CONFIG.minWidth, width);
                width += Math.sin(baseY * 0.032) * CONFIG.edgeJitter;

                const period = CONFIG.stripeWidth * 2;

                for (let x = -period * 4; x < width + period * 4; x += period) {
                    const drawX = leftX + x;
                    if (drawX + CONFIG.stripeWidth < 0 || drawX > WIDTH) continue;

                    ctx.fillStyle = '#E8E9E4';
                    ctx.fillRect(Math.floor(drawX), Math.floor(y), CONFIG.stripeWidth, CONFIG.bandHeight);

                    ctx.fillStyle = '#6d94ff';
                    ctx.fillRect(Math.floor(drawX + CONFIG.stripeWidth), Math.floor(y), CONFIG.stripeWidth, CONFIG.bandHeight);
                }

                // ctx.fillStyle = 'rgba(255,255,255,1)';
                // ctx.fillRect(0, y, WIDTH, 2);
            }
        }

        function loop() {
            draw();
            requestAnimationFrame(loop);
        }

        function init() {
            resize();

            window.addEventListener('mousemove', e => {
                mouseX = e.clientX;
                mouseY = e.clientY;
            });

            window.addEventListener('touchmove', e => {
                if (e.touches.length > 0) {
                    mouseX = e.touches[0].clientX;
                    mouseY = e.touches[0].clientY;
                }
            }, { passive: true });

            mouseX = WIDTH * 0.5;
            mouseY = HEIGHT * 0.5;

            loop();
            window.addEventListener('resize', resize);
}

window.onload = init;