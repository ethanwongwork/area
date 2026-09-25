// Rasterise icons at 1× or 2× into canvases and show them enlarged with hard pixel edges,
// so 1× (non-retina) rendering can be judged on any display. Gallery only.
for (const cell of document.querySelectorAll('[data-pixel-preview]')) {
  const holder = cell.querySelector('[data-scale]');
  const svg = holder && (holder instanceof SVGSVGElement ? holder : holder.querySelector('svg'));
  if (!svg) continue;
  const scale = Number(holder.getAttribute('data-scale')) || 1;
  const size = Number(holder.getAttribute('data-size')) || 16;  // CSS px the icon renders at
  const clone = svg.cloneNode(true);
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('width', size * scale); clone.setAttribute('height', size * scale);
  clone.style.color = getComputedStyle(cell).color;
  const markup = new XMLSerializer().serializeToString(clone).replaceAll('currentColor', getComputedStyle(cell).color);
  const image = new Image();
  image.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size * scale;
    canvas.getContext('2d').drawImage(image, 0, 0);
    canvas.className = 'docs-pixel-preview';
    if (size !== 16) canvas.style.inlineSize = canvas.style.blockSize = size * 4 + 'px';  // keep 4 screen px per icon px
    canvas.setAttribute('aria-hidden', 'true');
    holder.replaceWith(canvas);
  };
  image.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(markup);
}
