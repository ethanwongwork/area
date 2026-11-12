import '@fontsource-variable/inter-tight';
import '@fontsource-variable/jetbrains-mono';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import gsap from 'gsap';
import { shell, fontsReady } from '../../src/shell.js';

const { gui, thumb, font } = shell('002-oval');

// A glass oval ring floats in front of a type poster and bends it.
const p = {
  word: 'OVAL',
  paper: '#e9e7e2',
  ink: '#121212',
  accent: '#ff4a1c',
  thickness: 1.6,
  ior: 1.45,
  dispersion: 4,
  roughness: 0.04,
  iridescence: 0.35,
  spin: 0.25,
};

const stage = document.getElementById('stage');
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: thumb });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.toneMapping = THREE.NeutralToneMapping;
stage.append(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(p.paper);
const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
camera.position.set(0, 0, 10);

const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.9;

// --- The poster behind: drawn once to a canvas, sized to fill the view at z = -3.
const posterZ = -3;
const posterCanvas = document.createElement('canvas');
const posterTex = new THREE.CanvasTexture(posterCanvas);
posterTex.colorSpace = THREE.SRGBColorSpace;
posterTex.anisotropy = 8;
const poster = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: posterTex, toneMapped: false }));
poster.position.z = posterZ;
scene.add(poster);

const grotesk = font(['ABCDiatype', 'PPNeueMontreal'], 'Inter Tight Variable');

function drawPoster(w, h) {
  const dpr = Math.min(devicePixelRatio, 2);
  posterCanvas.width = Math.round(w * dpr);
  posterCanvas.height = Math.round(h * dpr);
  const c = posterCanvas.getContext('2d');
  c.scale(dpr, dpr);
  c.fillStyle = p.paper;
  c.fillRect(0, 0, w, h);

  // Word: as large as the width allows, tight tracking.
  c.fillStyle = p.ink;
  c.textBaseline = 'alphabetic';
  let size = h;
  c.font = `800 ${size}px ${grotesk}`;
  c.letterSpacing = `${-size * 0.06}px`;
  const m = c.measureText(p.word);
  size *= (w * 0.94) / m.width;
  size = Math.min(size, h * 0.62);
  c.font = `800 ${size}px ${grotesk}`;
  c.letterSpacing = `${-size * 0.06}px`;
  const ww = c.measureText(p.word).width;
  c.fillText(p.word, (w - ww) / 2, h * 0.5 + size * 0.36);

  // Stripes and a dot give the glass something to bend.
  c.fillStyle = p.accent;
  c.beginPath();
  c.arc(w * 0.78, h * 0.24, Math.min(w, h) * 0.07, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = p.ink;
  const stripes = 18;
  for (let i = 0; i < stripes; i++) c.fillRect(w * 0.06 + i * 9, h * 0.8, 3, h * 0.12);

  // Small type.
  c.font = `400 11px "JetBrains Mono Variable"`;
  c.letterSpacing = '0.4px';
  const lines = ['FORM STUDY / 002', 'GLASS, IOR 1.45', 'REFRACTION OVER TYPE'];
  lines.forEach((l, i) => c.fillText(l, w * 0.06, h * 0.12 + i * 15));
  c.textAlign = 'right';
  c.fillText('2026', w * 0.94, h * 0.92);
  posterTex.needsUpdate = true;
}

// --- The oval: a torus, stretched.
const material = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  metalness: 0,
  roughness: p.roughness,
  transmission: 1,
  thickness: p.thickness,
  ior: p.ior,
  dispersion: p.dispersion,
  iridescence: p.iridescence,
  iridescenceIOR: 1.3,
  clearcoat: 1,
  clearcoatRoughness: 0.02,
  specularIntensity: 1,
  envMapIntensity: 1,
});
const ring = new THREE.Mesh(new THREE.TorusGeometry(1, 0.42, 96, 256), material);
ring.scale.set(1.45, 1, 1.1);
const group = new THREE.Group();
group.add(ring);
scene.add(group);

// A small rounded block orbits the ring.
const block = new THREE.Mesh(new RoundedBoxGeometry(0.42, 0.42, 0.42, 6, 0.12), new THREE.MeshPhysicalMaterial({ color: p.accent, roughness: 0.25, clearcoat: 1 }));
scene.add(block);

scene.add(new THREE.DirectionalLight(0xffffff, 1.2).translateX(3).translateY(4).translateZ(5));

function resize() {
  const w = innerWidth;
  const h = innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  // Poster fills the frustum at its depth.
  const dist = camera.position.z - posterZ;
  const ph = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * dist;
  poster.scale.set(ph * camera.aspect, ph, 1);
  drawPoster(w, h);
  // Ring fits the narrow side.
  const fit = Math.min(1, camera.aspect / 0.9);
  group.scale.setScalar(fit);
}

const pointer = new THREE.Vector2();
const tilt = new THREE.Vector2();
addEventListener('pointermove', (e) => pointer.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1));
addEventListener('resize', resize);

const f = gui.addFolder('Glass');
f.add(p, 'thickness', 0, 4, 0.01).onChange((v) => (material.thickness = v));
f.add(p, 'ior', 1, 2.33, 0.01).onChange((v) => (material.ior = v));
f.add(p, 'dispersion', 0, 10, 0.1).onChange((v) => (material.dispersion = v));
f.add(p, 'roughness', 0, 0.5, 0.005).onChange((v) => (material.roughness = v));
f.add(p, 'iridescence', 0, 1, 0.01).onChange((v) => (material.iridescence = v));
gui.add(p, 'spin', 0, 1, 0.01);
gui.add(p, 'word').onFinishChange(resize);
gui.addColor(p, 'accent').onChange((v) => {
  block.material.color.set(v);
  resize();
});

await fontsReady(`800 100px ${grotesk}`, '400 11px "JetBrains Mono Variable"');
resize();

gsap.from(group.scale, { x: 0.001, y: 0.001, z: 0.001, duration: 1.6, ease: 'elastic.out(1, 0.55)', delay: 0.15 });
gsap.from(group.rotation, { y: -Math.PI, duration: 2.2, ease: 'expo.out' });

const clock = new THREE.Clock();
let spin = 0;
if (thumb) {
  // Hold a three-quarter view for the still.
  p.spin = 0;
  spin = 0.25;
}
renderer.setAnimationLoop(() => {
  const dt = Math.min(clock.getDelta(), 0.05);
  const t = clock.elapsedTime;
  spin += dt * p.spin;
  tilt.lerp(pointer, 0.05);
  ring.rotation.set(0.35 * Math.sin(spin * 1.3) - tilt.y * 0.5, spin * 2 + tilt.x * 0.7, 0.18 * Math.sin(spin));
  group.position.y = Math.sin(t * 0.8) * 0.08;

  // The block orbits the ring, passing behind it (and through its refraction).
  const a = t * 0.9;
  block.position.set(Math.cos(a) * 2.7 * group.scale.x, Math.sin(a * 2) * 0.3, Math.sin(a) * 1.6);
  block.rotation.set(t * 0.7, t * 1.1, 0);
  renderer.render(scene, camera);
});
