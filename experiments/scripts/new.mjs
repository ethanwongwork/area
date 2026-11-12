// Starts a new experiment: e/<NNN-slug>/ with a page, a script and a style, and a registry entry.
//
//   npm run new -- "Title" Kind [three]
//
// Kind is one of Type, Interaction, Vector, Color, Poster, 3D, Collage.
// Add "three" to start from a three.js canvas instead of a DOM stage.
import { existsSync, mkdirSync, readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const [title, kind = 'Type', template = 'dom'] = process.argv.slice(2);
const kinds = ['Type', 'Interaction', 'Vector', 'Color', 'Poster', '3D', 'Collage'];
if (!title || !kinds.includes(kind)) {
  console.error(`Usage: npm run new -- "Title" <${kinds.join('|')}> [three]`);
  process.exit(1);
}

const registryPath = resolve(root, 'experiments.json');
const registry = JSON.parse(readFileSync(registryPath, 'utf8'));
const next = Math.max(0, ...registry.map((e) => e.number ?? 0)) + 1;
const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const dir = resolve(root, 'e', slug);
if (existsSync(dir)) throw new Error(`${dir} exists`);
mkdirSync(dir, { recursive: true });

copyFileSync(resolve(root, 'e/glyph-flow/index.html'), resolve(dir, 'index.html'));

const dom = `import gsap from 'gsap';
import { shell } from '../../src/shell.js';

const { gui, thumb } = shell('${slug}');

const p = { speed: 1 };
gui.add(p, 'speed', 0, 3, 0.01);

const stage = document.getElementById('stage');
stage.innerHTML = '<h1>${title}</h1>';
gsap.from('h1', { yPercent: 100, opacity: 0, duration: 1.2, ease: 'expo.out' });
`;

const three = `import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { shell } from '../../src/shell.js';

const { gui, thumb } = shell('${slug}');

const p = { speed: 0.5 };
gui.add(p, 'speed', 0, 2, 0.01);

const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: thumb });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.toneMapping = THREE.NeutralToneMapping;
document.getElementById('stage').append(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color('#ece9e4');
scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture;
const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
camera.position.z = 6;

const mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 8), new THREE.MeshPhysicalMaterial({ color: '#ff4a1c', roughness: 0.3, clearcoat: 1 }));
scene.add(mesh);

function resize() {
  renderer.setSize(innerWidth, innerHeight, false);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
}
addEventListener('resize', resize);
resize();

const clock = new THREE.Clock();
renderer.setAnimationLoop(() => {
  mesh.rotation.y += clock.getDelta() * p.speed;
  renderer.render(scene, camera);
});
`;

const css =
  template === 'three'
    ? `body {\n  background: #ece9e4;\n}\n\ncanvas {\n  position: fixed;\n  inset: 0;\n  width: 100%;\n  height: 100%;\n  display: block;\n}\n`
    : `body {\n  background: #f2f0eb;\n  color: #111;\n}\n\n#stage {\n  position: fixed;\n  inset: 0;\n  display: grid;\n  place-items: center;\n}\n\nh1 {\n  margin: 0;\n  font: 500 12vw/0.9 'Helvetica Neue', sans-serif;\n  letter-spacing: -0.05em;\n}\n`;

writeFileSync(resolve(dir, 'main.js'), template === 'three' ? three : dom);
writeFileSync(resolve(dir, 'style.css'), css);

registry.push({ slug, number: next, title, kind, year: new Date().getFullYear(), ratio: '4/5', at: 2, hint: 'Move', tools: [] });
writeFileSync(registryPath, `[\n${registry.map((e) => `  ${JSON.stringify(e).replace(/,"/g, ', "').replace(/":/g, '": ')}`).join(',\n')}\n]\n`);

console.log(`e/${slug}/  →  http://localhost:5190/e/${slug}/   (restart the dev server so Vite sees the new page)`);
