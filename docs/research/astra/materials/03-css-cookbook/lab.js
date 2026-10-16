// All controls are local to this page; no storage, network, or product settings.
const root = document.documentElement;
for (const input of document.querySelectorAll('[data-css]')) {
  const update = () => {
    root.style.setProperty(input.dataset.css, input.value + (input.dataset.unit || ''));
    const output = document.querySelector(`output[for="${input.id}"]`);
    if (output) output.value = input.value + (input.dataset.unit || '');
    if (input.id === 'warp') document.querySelector('feDisplacementMap')?.setAttribute('scale', input.value);
  };
  input.addEventListener('input', update); update();
}
document.querySelector('#theme').addEventListener('change', event => { root.dataset.theme = event.target.value; });
document.querySelector('#reduce').addEventListener('change', event => {
  root.dataset.reduced = String(event.target.checked);
  document.querySelector('#warped-art')?.setAttribute('filter', event.target.checked ? 'none' : 'url(#refraction)');
});
const features = { 'backdrop blur': 'backdrop-filter:blur(1px)', 'mask ring': 'mask-composite:exclude',
 'squircle': 'corner-shape:squircle', 'color mix': 'color:color-mix(in srgb,red,transparent)',
 'relative color': 'color:oklch(from red calc(l + .04) c h)' };
document.querySelector('#support').textContent = 'This browser parses: ' +
 Object.entries(features).map(([name,value]) => `${name} ${CSS.supports(value) ? 'yes' : 'no'}`).join(' · ') +
 '. Syntax detection is not a rendering or accessibility test.';
