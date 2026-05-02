document.addEventListener("DOMContentLoaded", () => {
    // =========================
    // POINTER DETECTION
    // =========================
    const pointer = {
        current: 'mouse',
        init() {
            const update = (e) => {
                this.current = (e.pointerType === 'touch') ? 'touch' : 'mouse';
            };
            document.addEventListener('pointerdown', update);
            document.addEventListener('pointermove', update, { passive: true });

            if (window.matchMedia?.('(pointer: coarse)').matches) {
                this.current = 'touch';
            }
        },
        isTouch() { return this.current === 'touch'; },
        isMouse() { return this.current === 'mouse'; }
    };

    pointer.init();

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
  
    const imagesSrc = ["cursor.svg", "cursor2.svg", "cursor3.svg", "cursor4.svg"];
    const images = [];
    let loaded = 0;

    let stamps = [];
    let liveCursor = null;
    let needsNewStamp = false;   // ← New flag

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
      return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
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

    function getDrawSize(img, baseSize) {
      const aspect = img.width / img.height;
      let w = baseSize, h = baseSize;
      if (aspect > 1) h = baseSize / aspect;
      else w = baseSize * aspect;
      return { w, h };
    }

    function drawStamp(stamp) {
      const img = images[stamp.index];
      const { w, h } = getDrawSize(img, stamp.size);
      ctx.save();
      ctx.translate(stamp.x, stamp.y);
      ctx.rotate(stamp.rotation);
      ctx.drawImage(img, -w / 2, -h / 2, w, h);
      ctx.restore();
    }

    function redrawAll() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stamps.forEach(drawStamp);
      if (liveCursor) drawStamp(liveCursor);
    }

    function createStamp(x = 0, y = 0, size = 360) {
      return {
        x, y,
        index: Math.floor(Math.random() * images.length),
        rotation: Math.random() * Math.PI * 2,
        size
      };
    }

    function cloneStamp(stamp) {
      return { ...stamp };
    }

    // =========================
    // INIT
    // =========================
    function init() {
      resizeCanvas();
      if (!pointer.isTouch()) {
        liveCursor = createStamp(0, 0, 360);
      }
      redrawAll();

      const observer = new ResizeObserver(() => { resizeCanvas(); redrawAll(); });
      observer.observe(document.body);
      window.addEventListener("resize", () => { resizeCanvas(); redrawAll(); });

      // Mouse movement
      document.addEventListener("pointermove", (e) => {
        if (pointer.isTouch() || !liveCursor) return;

        const x = e.clientX;
        const y = e.clientY + window.scrollY;

        // Change to new stamp only after movement (after a click)
        if (needsNewStamp) {
          liveCursor = createStamp(x, y, 360);
          needsNewStamp = false;
        } else {
          liveCursor.x = x;
          liveCursor.y = y;
        }

        redrawAll();
      });

      // Click / Tap
      document.addEventListener("pointerdown", (e) => {
        const x = e.clientX;
        const y = e.clientY + window.scrollY;

        if (pointer.isTouch()) {
          const newStamp = createStamp(x, y, 200);
          stamps.push(newStamp);
          drawStamp(newStamp);
        } else {
          if (liveCursor) {
            // Stamp with current cursor
            liveCursor.x = x;
            liveCursor.y = y;
            stamps.push(cloneStamp(liveCursor));
            drawStamp(liveCursor);

            // Mark that we need a new stamp on next move
            needsNewStamp = true;
          }
        }
      });
    }
});
//   END STAMPS //
//   
// 
// 
//   CANVAS INTO SECTION // 

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

// 

// 
// 

// 

const letters = [
    {
      el: document.getElementById("letterA"),
      path: "svg/A/A_"
    },
    {
      el: document.getElementById("letterB"),
      path: "svg/B/B_"
    },
    {
      el: document.getElementById("letterC"),
      path: "svg/C/C_"
    }
  ];
  
  // -------------------------------
  // 1. SAFE FRAME LOADER
  // -------------------------------
  function loadFramesSafely(path, maxProbe = 1000) {
    return new Promise((resolve) => {
      const frames = [];
      let i = 1;
  
      function tryLoad() {
        const img = new Image();
        const src = `${path}${i}.svg`;
  
        img.onload = () => {
          frames.push(img);
          i++;
          tryLoad(); // keep going
        };
  
        img.onerror = () => {
          // stop silently when first missing file appears
          resolve(frames);
        };
  
        img.src = src;
      }
  
      tryLoad();
    });
  }
  
  // -------------------------------
  // 2. INIT ALL LETTERS
  // -------------------------------
  async function init2() {
    for (const letter of letters) {
      letter.frames = await loadFramesSafely(letter.path);
      letter.index = 0;
  
      if (letter.frames.length > 0) {
        letter.el.src = letter.frames[0].src;
      } else {
        console.warn("No frames found for", letter.path);
      }
    }
  
    startAnimation();
  }
  
  // -------------------------------
  // 3. SEQUENTIAL LOOP ENGINE
  // -------------------------------
  function startAnimation() {
    let currentLetter = 0;
  
    const fps = 6;
    const interval = 1000 / fps;
    let lastTime = 0;
  
    function animate(time) {
      if (!lastTime) lastTime = time;
  
      if (time - lastTime >= interval) {
        const letter = letters[currentLetter];
  
        if (letter.frames && letter.frames.length > 0) {
          letter.index = (letter.index + 1) % letter.frames.length;
          letter.el.src = letter.frames[letter.index].src;
        }
  
        // move to next letter (A → B → C → loop)
        currentLetter = (currentLetter + 1) % letters.length;
  
        lastTime = time;
      }
  
      requestAnimationFrame(animate);
    }
  
    requestAnimationFrame(animate);
  }
  
  // start everything
  init2();