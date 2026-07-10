// ============================================================
// PORTFOLIO INTERACTIONS
// Three sections: 3D hero (Three.js), scroll-reveal animations
// (IntersectionObserver), and small interaction polish (magnetic
// buttons, custom cursor). Each is wrapped so one failing doesn't
// take down the others.
// ============================================================

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ------------------------------------------------------------
// 1. Three.js hero background
// ------------------------------------------------------------
function initHero3D() {
  if (prefersReducedMotion || typeof THREE === 'undefined') return;

  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 6;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const group = new THREE.Group();
  scene.add(group);

  // Main wireframe shape -- an icosahedron reads as "geometric / technical"
  const mainGeo = new THREE.IcosahedronGeometry(1.9, 1);
  const mainMat = new THREE.MeshBasicMaterial({ color: 0x7c5cfc, wireframe: true, transparent: true, opacity: 0.55 });
  const mainMesh = new THREE.Mesh(mainGeo, mainMat);
  group.add(mainMesh);

  // A second, smaller shape offset in depth for parallax richness
  const innerGeo = new THREE.IcosahedronGeometry(1.1, 0);
  const innerMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee, wireframe: true, transparent: true, opacity: 0.35 });
  const innerMesh = new THREE.Mesh(innerGeo, innerMat);
  group.add(innerMesh);

  group.position.set(2.2, 0, 0);

  // Scattered points for depth, subtle
  const starCount = 200;
  const starGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 4;
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const starMat = new THREE.PointsMaterial({ color: 0x8e8e9c, size: 0.02, transparent: true, opacity: 0.6 });
  const stars = new THREE.Points(starGeo, starMat);
  scene.add(stars);

  let mouseX = 0;
  let mouseY = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  function animate() {
    requestAnimationFrame(animate);
    mainMesh.rotation.x += 0.0015;
    mainMesh.rotation.y += 0.002;
    innerMesh.rotation.x -= 0.001;
    innerMesh.rotation.y -= 0.0025;

    // Gentle parallax toward the mouse, eased
    group.rotation.y += (mouseX * 0.3 - group.rotation.y) * 0.02;
    group.rotation.x += (mouseY * 0.2 - group.rotation.x) * 0.02;

    stars.rotation.y += 0.0002;

    renderer.render(scene, camera);
  }
  animate();
}

// ------------------------------------------------------------
// 2. Scroll reveal via IntersectionObserver
// ------------------------------------------------------------
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || prefersReducedMotion) {
    items.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 60);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach(el => observer.observe(el));
}

// ------------------------------------------------------------
// 3. Magnetic buttons -- nudge toward the cursor within a radius
// ------------------------------------------------------------
function initMagneticButtons() {
  if (prefersReducedMotion) return;
  const magnets = document.querySelectorAll('.magnetic');

  magnets.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - rect.left - rect.width / 2;
      const relY = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${relX * 0.25}px, ${relY * 0.25}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0, 0)';
    });
  });
}

// ------------------------------------------------------------
// 4. Custom cursor dot
// ------------------------------------------------------------
function initCustomCursor() {
  const dot = document.getElementById('cursorDot');
  if (!dot) return;

  window.addEventListener('mousemove', (e) => {
    dot.style.left = `${e.clientX}px`;
    dot.style.top = `${e.clientY}px`;
  });

  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => dot.classList.add('hover'));
    el.addEventListener('mouseleave', () => dot.classList.remove('hover'));
  });
}

// ------------------------------------------------------------
// Init everything once the DOM is ready
// ------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  try { initHero3D(); } catch (e) { console.warn('3D hero failed to init:', e); }
  try { initScrollReveal(); } catch (e) { console.warn('Scroll reveal failed:', e); }
  try { initMagneticButtons(); } catch (e) { console.warn('Magnetic buttons failed:', e); }
  try { initCustomCursor(); } catch (e) { console.warn('Custom cursor failed:', e); }
});
