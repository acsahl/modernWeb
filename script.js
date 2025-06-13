// Initialize Locomotive Scroll
const scroll = new LocomotiveScroll({
    el: document.querySelector('[data-scroll-container]'),
    smooth: true,
    multiplier: 1,
    lerp: 0.05
});
window.scroll = scroll;

// Custom cursor with smooth movement
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');
let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;
let followerX = 0;
let followerY = 0;
let lastX = 0;
let lastY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Calculate movement direction for Pacman rotation
    const deltaX = e.clientX - lastX;
    const deltaY = e.clientY - lastY;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal movement
        cursor.style.transform = `rotate(${deltaX > 0 ? '0deg' : '180deg'})`;
    } else {
        // Vertical movement
        cursor.style.transform = `rotate(${deltaY > 0 ? '90deg' : '-90deg'})`;
    }
    
    lastX = e.clientX;
    lastY = e.clientY;
});

// Smooth cursor animation
function animateCursor() {
    // Smooth cursor movement
    cursorX += (mouseX - cursorX) * 0.1;
    cursorY += (mouseY - cursorY) * 0.1;
    // Offset by half the cursor size (12px for 24px cursor)
    cursor.style.left = (cursorX - 12) + 'px';
    cursor.style.top = (cursorY - 12) + 'px';

    // Smooth follower movement with delay
    followerX += (mouseX - followerX) * 0.05;
    followerY += (mouseY - followerY) * 0.05;
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top = followerY + 'px';

    requestAnimationFrame(animateCursor);
}

animateCursor();

// GSAP Animations
gsap.registerPlugin(ScrollTrigger);

// Reveal text animations with stagger
const revealTexts = document.querySelectorAll('.reveal-text');

gsap.to(revealTexts, {
    scrollTrigger: {
        trigger: revealTexts,
        start: "top 80%",
        toggleActions: "play none none reverse"
    },
    y: 0,
    opacity: 1,
    duration: 1,
    stagger: 0.2,
    ease: "power3.out"
});

// Parallax effect for sections
document.querySelectorAll('section').forEach(section => {
    gsap.to(section, {
        scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1
        },
        y: (i, target) => -target.offsetHeight * 0.05,
        ease: "none"
    });
});

// Subtle ghost animations
const ghosts = document.querySelectorAll('.ghost');
ghosts.forEach(ghost => {
    gsap.to(ghost, {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
    });
});

// Interactive elements hover effect
const interactiveElements = document.querySelectorAll('a, button, .feature-item');

interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
        gsap.to(cursor, {
            scale: 1.5,
            duration: 0.3,
            ease: "power2.out"
        });
        gsap.to(cursorFollower, {
            scale: 1.5,
            duration: 0.3,
            ease: "power2.out"
        });
    });

    element.addEventListener('mouseleave', () => {
        gsap.to(cursor, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
        });
        gsap.to(cursorFollower, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
        });
    });
});

// Update ScrollTrigger when window is resized
window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
});

// 3D Pacman with Three.js
function createPacman3D() {
  const container = document.getElementById('pacman-3d-container');
  if (!container) return;

  // Scene, camera, renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.offsetWidth, container.offsetHeight);
  container.appendChild(renderer.domElement);

  // Pacman body (just a rotating yellow sphere)
  const pacmanGeometry = new THREE.SphereGeometry(1, 64, 64);
  const pacmanMaterial = new THREE.MeshPhongMaterial({ color: 0xffff00, shininess: 100 });
  const pacman = new THREE.Mesh(pacmanGeometry, pacmanMaterial);
  scene.add(pacman);

  // Eyes (optional, can be commented out if you want a pure sphere)
  const eyeGeometry = new THREE.SphereGeometry(0.07, 16, 16);
  const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });

  const eyeLeft = new THREE.Mesh(eyeGeometry, eyeMaterial);
  const eyeRight = new THREE.Mesh(eyeGeometry, eyeMaterial);

  eyeLeft.position.set(-0.25, 0.35, 0.88);
  eyeRight.position.set(0.25, 0.35, 0.88);

  pacman.add(eyeLeft);
  pacman.add(eyeRight);

  // Lighting
  const pointLight = new THREE.PointLight(0xffffff, 1.2, 100);
  pointLight.position.set(3, 5, 5);
  scene.add(pointLight);

  // Optional: ambient light for softer base lighting
  const ambientLight = new THREE.AmbientLight(0x404040, 0.5); 
  scene.add(ambientLight);

  camera.position.z = 3;

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    pacman.rotation.y += 0.01;
    renderer.render(scene, camera);
  }
  animate();
}

// Call the function after DOM is loaded
window.addEventListener('DOMContentLoaded', createPacman3D);

// Smooth scroll for floating menu links using Locomotive Scroll
const menuLinks = document.querySelectorAll('.floating-menu a');
menuLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href').slice(1);
    const target = document.getElementById(targetId);
    if (target && window.scroll) {
      e.preventDefault();
      // Use Locomotive Scroll's scrollTo
      window.scroll.scrollTo(target, { offset: 0, duration: 800, easing: [0.25, 0.00, 0.35, 1.00] });
    }
  });
});

// Play start.mp3 when the website is opened (after user interaction for autoplay policy)
window.addEventListener('DOMContentLoaded', () => {
  const audio = document.getElementById('start-sound');
  if (audio) {
    // Try to play immediately (may be blocked)
    audio.play().catch(() => {
      // If blocked, play on first user interaction
      const playAudio = () => {
        audio.play();
        window.removeEventListener('click', playAudio);
        window.removeEventListener('keydown', playAudio);
      };
      window.addEventListener('click', playAudio);
      window.addEventListener('keydown', playAudio);
    });
  }
});

// Random Dots Game Logic
const NUM_DOTS = 10;
let dotsFound = 0;
let moodModeActive = false;
let themeChangingEnabled = true;

function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

function showResumeModal() {
  const modal = document.getElementById('resume-modal');
  if (modal) {
    modal.style.display = 'flex';
    setTimeout(() => { modal.style.opacity = 1; }, 10);
  }
}
function hideResumeModal() {
  const modal = document.getElementById('resume-modal');
  if (modal) {
    modal.style.opacity = 0;
    setTimeout(() => { modal.style.display = 'none'; }, 250);
  }
}
// Attach close logic
window.addEventListener('DOMContentLoaded', () => {
  const closeBtn = document.querySelector('.resume-modal-close');
  const modal = document.getElementById('resume-modal');
  if (closeBtn && modal) {
    closeBtn.addEventListener('click', hideResumeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) hideResumeModal();
    });
  }
});

function createRandomDots() {
  const sections = Array.from(document.querySelectorAll('section'));
  if (!sections.length) return;
  let dotsPlaced = 0;
  while (dotsPlaced < NUM_DOTS) {
    // Pick a random section
    const section = sections[Math.floor(Math.random() * sections.length)];
    // Create a dot
    const dot = document.createElement('div');
    dot.className = 'random-dot';
    // Place randomly within the section (as a percent)
    dot.style.left = `${randomInRange(5, 95)}%`;
    dot.style.top = `${randomInRange(10, 80)}%`;
    dot.style.position = 'absolute';
    // On hover, mark as found
    dot.addEventListener('mouseenter', () => {
      if (!dot.classList.contains('found')) {
        dot.classList.add('found');
        dotsFound++;
        updateDotCounter();
        if (dotsFound === NUM_DOTS) {
          showResumeModal();
        }
      }
    });
    // Place dot in the section
    section.appendChild(dot);
    dotsPlaced++;
  }
}

function updateDotCounter() {
  const counter = document.getElementById('dot-counter');
  if (counter) {
    counter.textContent = `${dotsFound}/${NUM_DOTS}`;
    counter.style.display = 'block';
  }
  if (dotsFound === NUM_DOTS && !moodModeActive) {
    moodModeActive = true;
    document.body.classList.remove('blue-accent');
    setupFaceAPI(); // Start browser-based mood detection
  }
}

window.addEventListener('DOMContentLoaded', () => {
  createRandomDots();
  updateDotCounter();
});

// Expanded emotion-to-color scheme for mood bracelet
const emotionSchemes = {
  happy:    { accent: "#FFD600", bg: "#FFFDE7", text: "#222" },
  sad:      { accent: "#2196F3", bg: "#E3F2FD", text: "#222" },
  angry:    { accent: "#F44336", bg: "#FFEBEE", text: "#222" },
  neutral:  { accent: "#9E9E9E", bg: "#212121", text: "#fff" },
  surprised: { accent: "#FF9800", bg: "#FFF3E0", text: "#222" },
  fearful:     { accent: "#673AB7", bg: "#EDE7F6", text: "#222" },
  disgusted:  { accent: "#4CAF50", bg: "#E8F5E9", text: "#222" }
};

function setColorScheme(scheme) {
  document.documentElement.style.setProperty('--accent', scheme.accent);
  document.documentElement.style.setProperty('--bg-dark', scheme.bg);
  document.documentElement.style.setProperty('--bg-light', scheme.bg);
  document.documentElement.style.setProperty('--text-primary', scheme.text);
  document.documentElement.style.setProperty('--text-secondary', scheme.text);
}

// Theme toggle logic
window.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('theme-toggle');
  const icon = document.getElementById('theme-toggle-icon');
  if (toggle && icon) {
    toggle.addEventListener('click', () => {
      themeChangingEnabled = !themeChangingEnabled;
      icon.textContent = themeChangingEnabled ? '⏸️' : '▶️';
    });
  }
});

// 2. Setup face-api.js and webcam
async function setupFaceAPI() {
  const MODEL_URL = 'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/weights';
  await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
  await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
  const video = document.getElementById('moodcam');
  navigator.mediaDevices.getUserMedia({ video: {} })
    .then(stream => { video.srcObject = stream; });
  video.onplay = () => detectMood(video);
}

// 3. Detect mood every 8 seconds
async function detectMood(video) {
  setInterval(async () => {
    const detections = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions();
    if (detections && detections.expressions) {
      const sorted = Object.entries(detections.expressions).sort((a, b) => b[1] - a[1]);
      const mood = sorted[0][0];
      const scheme = emotionSchemes[mood] || emotionSchemes.happy;
      if (themeChangingEnabled) setColorScheme(scheme);
      // Update your dialog, etc.
      const dialog = document.getElementById('emotion-dialog');
      const value = document.getElementById('emotion-value');
      if (dialog && value) {
        dialog.style.display = 'flex';
        value.textContent = mood;
      }
    }
  }, 8000); // every 8 seconds
}

// Hide the dialog initially
window.addEventListener('DOMContentLoaded', () => {
  const dialog = document.getElementById('emotion-dialog');
  if (dialog) dialog.style.display = 'none';
});

// FaceAPI test button logic
window.addEventListener('DOMContentLoaded', () => {
  const testBtn = document.getElementById('test-faceapi-btn');
  if (testBtn) {
    testBtn.addEventListener('click', async () => {
      const MODEL_URL = 'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/weights';
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
      console.log('Models loaded from CDN');
      const video = document.getElementById('moodcam');
      navigator.mediaDevices.getUserMedia({ video: {} })
        .then(stream => { video.srcObject = stream; });
      video.onplay = () => {
        setInterval(async () => {
          const detections = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions();
          if (detections && detections.expressions) {
            const sorted = Object.entries(detections.expressions).sort((a, b) => b[1] - a[1]);
            const mood = sorted[0][0];
            alert('Detected mood: ' + mood);
          }
        }, 5000); // every 5 seconds
      };
    });
  }
}); 