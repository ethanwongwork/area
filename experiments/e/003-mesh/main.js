import '@fontsource-variable/fraunces/full.css';
import '@fontsource-variable/jetbrains-mono';
import * as THREE from 'three';
import gsap from 'gsap';
import { shell } from '../../src/shell.js';
import frag from './mesh.frag?raw';

const { gui, thumb, reduced } = shell('003-mesh');

// Four colours, mapped through a domain-warped noise field. Click for the next palette.
const palettes = [
  { name: 'Dusk', colors: ['#0b0a24', '#3624d6', '#ff5b2e', '#ffd8b0'] },
  { name: 'Lagoon', colors: ['#01161c', '#00707d', '#5ce1b9', '#f3f0de'] },
  { name: 'Acid', colors: ['#0c0c0c', '#2f37ff', '#c6ff1a', '#f4f4f0'] },
  { name: 'Bloom', colors: ['#2a0712', '#c2124f', '#ff8db0', '#fff1f4'] },
  { name: 'Ember', colors: ['#120604', '#7a1500', '#ff7a00', '#fff3c4'] },
];
const p = { speed: 0.08, warp: 0.9, scale: 0.55, grain: 0.05, palette: 0 };

const renderer = new THREE.WebGLRenderer({ antialias: false, preserveDrawingBuffer: thumb });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
document.getElementById('stage').append(renderer.domElement);

const uniforms = {
  uTime: { value: 0 },
  uRes: { value: new THREE.Vector2() },
  uPointer: { value: new THREE.Vector2(0.5, 0.5) },
  uWarp: { value: p.warp },
  uScale: { value: p.scale },
  uGrain: { value: p.grain },
  uColors: { value: palettes[0].colors.map((c) => new THREE.Color(c)) },
};

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
scene.add(
  new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.ShaderMaterial({
      uniforms,
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position, 1.0); }',
      fragmentShader: frag,
    }),
  ),
);

// Legend: the palette's name and hex values.
const legend = document.createElement('ul');
legend.className = 'legend';
const name = document.createElement('p');
name.className = 'name';
document.body.append(name, legend);

function showLegend(i) {
  const pal = palettes[i];
  name.textContent = pal.name;
  legend.innerHTML = pal.colors.map((c) => `<li><i style="--c:${c}"></i>${c}</li>`).join('');
}

function setPalette(i) {
  p.palette = i;
  showLegend(i);
  palettes[i].colors.forEach((hex, k) => {
    const to = new THREE.Color(hex);
    gsap.to(uniforms.uColors.value[k], { r: to.r, g: to.g, b: to.b, duration: 1.4, ease: 'power3.inOut', delay: k * 0.06 });
  });
  gsap.fromTo(name, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out' });
}

const pointer = new THREE.Vector2(0.5, 0.5);
addEventListener('pointermove', (e) => pointer.set(e.clientX / innerWidth, 1 - e.clientY / innerHeight));
addEventListener('click', () => setPalette((p.palette + 1) % palettes.length));

function resize() {
  renderer.setSize(innerWidth, innerHeight, false);
  renderer.getDrawingBufferSize(uniforms.uRes.value);
}
addEventListener('resize', resize);
resize();
showLegend(0);

gui.add(p, 'speed', 0, 0.6, 0.01);
gui.add(p, 'warp', 0, 4, 0.01).onChange((v) => (uniforms.uWarp.value = v));
gui.add(p, 'scale', 0.3, 4, 0.01).onChange((v) => (uniforms.uScale.value = v));
gui.add(p, 'grain', 0, 0.2, 0.005).onChange((v) => (uniforms.uGrain.value = v));
gui.add(p, 'palette', Object.fromEntries(palettes.map((x, i) => [x.name, i]))).onChange(setPalette);

let t = 3.0;
const clock = new THREE.Clock();
renderer.setAnimationLoop(() => {
  t += clock.getDelta() * p.speed * (reduced ? 0.25 : 1);
  uniforms.uTime.value = t;
  uniforms.uPointer.value.lerp(pointer, 0.04);
  renderer.render(scene, camera);
});
