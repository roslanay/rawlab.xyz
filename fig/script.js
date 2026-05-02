// document.addEventListener("DOMContentLoaded", () => {
//     const cursor = document.getElementById("cursor");
  
//     const images = [
//       "cursor.svg",
//       "cursor2.svg",
//       "cursor3.svg",
//       "cursor4.svg"
//     ];
  
//     let currentImage = images[0];
//     let currentRotation = Math.random() * 360;
  
//     let pendingImage = null;
//     let pendingRotation = null;

//     // Apply initial cursor
//     cursor.src = currentImage;
//     cursor.style.transform = `translate(-50%, -50%) rotate(${currentRotation}deg)`;
  
//     document.addEventListener("mousemove", (e) => {
//       // Move cursor
//       cursor.style.left = e.clientX + "px";
//       cursor.style.top = e.clientY + "px";
  
//       // Apply pending update ONLY on movement
//       if (pendingImage !== null) {
//         currentImage = pendingImage;
//         currentRotation = pendingRotation;
  
//         cursor.src = currentImage;
//         cursor.style.transform = `translate(-50%, -50%) rotate(${currentRotation}deg)`;
  
//         pendingImage = null;
//         pendingRotation = null;
//       }
//     });
  
//     document.addEventListener("click", (e) => {
//       // 1. Stamp with current state
//       const stamp = document.createElement("img");
//       stamp.src = currentImage;
  
//       stamp.classList.add("stamp");
//       stamp.style.position = "absolute";
//       stamp.style.left = e.pageX + "px";
//       stamp.style.top = e.pageY + "px";
  
//       stamp.style.transform = `
//         translate(-50%, -50%)
//         rotate(${currentRotation}deg)
//       `;
  
//       document.body.appendChild(stamp);
  
//       // 2. Prepare next image (but don't apply yet)
//       let nextImage;
//       do {
//         nextImage = images[Math.floor(Math.random() * images.length)];
//       } while (images.length > 1 && nextImage === currentImage);
  
//       const nextRotation = Math.random() * 360;
  
//       pendingImage = nextImage;
//       pendingRotation = nextRotation;
//     });
//   });

  // 
  // 
  // 
  
  document.addEventListener("DOMContentLoaded", () => {
    // =========================
    // CANVAS (WORLD LAYER)
    // =========================
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
  
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.zIndex = "0";
  
    document.body.appendChild(canvas);
  
    let dpr = window.devicePixelRatio || 1;
  
    function resizeCanvas() {
      dpr = window.devicePixelRatio || 1;
  
      const height = document.body.scrollHeight;
  
      canvas.width = window.innerWidth * dpr;
      canvas.height = height * dpr;
  
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = height + "px";
  
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  
      redrawAll();
    }
  
    window.addEventListener("resize", resizeCanvas);
  
    // =========================
    // CURSOR
    // =========================
    const cursor = document.getElementById("cursor");
  
    const CURSOR_SIZE = 300;
    const STAMP_SIZE = 300;
  
    const imagesSrc = [
      "cursor.svg",
      "cursor2.svg",
      "cursor3.svg",
      "cursor4.svg"
    ];
  
    const images = [];
    let loaded = 0;
  
    imagesSrc.forEach((src, i) => {
      const img = new Image();
      img.src = src;
  
      img.onload = () => {
        loaded++;
        if (loaded === imagesSrc.length) init();
      };
  
      images.push(img);
    });
  
    let currentIndex = 0;
    let currentRotation = Math.random() * 360;
  
    let pendingIndex = null;
    let pendingRotation = null;
  
    // =========================
    // STAMP DATA (WORLD SPACE)
    // =========================
    const stamps = [];
  
    // =========================
    // HELPERS
    // =========================
    function getDrawSize(img, size) {
      const aspect = img.width / img.height;
  
      let width, height;
  
      if (aspect > 1) {
        width = size;
        height = size / aspect;
      } else {
        height = size;
        width = size * aspect;
      }
  
      return { width, height };
    }
  
    function updateCursor() {
      const img = images[currentIndex];
  
      cursor.src = imagesSrc[currentIndex];
  
      const { width, height } = getDrawSize(img, CURSOR_SIZE);
  
      cursor.style.width = width + "px";
      cursor.style.height = height + "px";
  
      cursor.style.transform = `
        translate(-50%, -50%)
        rotate(${currentRotation}deg)
      `;
    }
  
    // =========================
    // DRAW STAMP (WORLD SPACE)
    // =========================
    function drawStamp(stamp) {
      const img = images[stamp.index];
  
      const { width, height } = getDrawSize(img, STAMP_SIZE);
  
      ctx.save();
  
      ctx.translate(stamp.x, stamp.y);
      ctx.rotate((stamp.rotation * Math.PI) / 180);
  
      ctx.drawImage(
        img,
        -width / 2,
        -height / 2,
        width,
        height
      );
  
      ctx.restore();
    }
  
    function redrawAll() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stamps.forEach(drawStamp);
    }
  
    // =========================
    // INIT
    // =========================
    function init() {
      resizeCanvas();
      updateCursor();
  
      // ===== CURSOR MOVE =====
      document.addEventListener("mousemove", (e) => {
        cursor.style.left = e.clientX + "px";
        cursor.style.top = e.clientY + "px";
  
        if (pendingIndex !== null) {
          currentIndex = pendingIndex;
          currentRotation = pendingRotation;
  
          updateCursor();
  
          pendingIndex = null;
          pendingRotation = null;
        }
      });
  
      // =========================
      // CLICK → ADD STAMP
      // =========================
      document.addEventListener("click", (e) => {
        stamps.push({
          x: e.clientX,
          y: e.clientY + window.scrollY, // 🔥 key for scroll world
          index: currentIndex,
          rotation: currentRotation
        });
  
        redrawAll();
  
        let next;
        do {
          next = Math.floor(Math.random() * images.length);
        } while (images.length > 1 && next === currentIndex);
  
        pendingIndex = next;
        pendingRotation = Math.random() * 360;
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