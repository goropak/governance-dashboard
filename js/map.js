import Store from './sync.js';

const SVG_W = 800, SVG_H = 500;

const ZONES = [
  { era: 'cognitive',   x1: 0,    y1: 0,    x2: 0.32, y2: 0.55 },
  { era: 'agri',        x1: 0,    y1: 0.55, x2: 0.32, y2: 1    },
  { era: 'industrial',  x1: 0.32, y1: 0,    x2: 0.82, y2: 1    },
  { era: 'info',        x1: 0.82, y1: 0,    x2: 1,    y2: 1    },
];

function svgEl(tag, attrs) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  return el;
}

document.addEventListener('data:ready', () => {
  const { eras, cities } = window.GovData;
  const svg = document.getElementById('map');
  if (!svg) return;

  const eraMap = Object.fromEntries(eras.map(e => [e.id, e]));

  // 시대 배경 존
  ZONES.forEach(zone => {
    const era = eraMap[zone.era];
    if (!era) return;
    const rect = svgEl('rect', {
      x: zone.x1 * SVG_W, y: zone.y1 * SVG_H,
      width: (zone.x2 - zone.x1) * SVG_W,
      height: (zone.y2 - zone.y1) * SVG_H,
      fill: era.color, opacity: '0.08',
      rx: '8'
    });
    svg.appendChild(rect);

    const tx = ((zone.x1 + zone.x2) / 2) * SVG_W;
    const ty = zone.y1 * SVG_H + 20;
    const text = svgEl('text', {
      x: tx, y: ty,
      'text-anchor': 'middle',
      fill: era.color,
      'font-size': '11',
      opacity: '0.7',
      'font-family': 'var(--font-body)'
    });
    text.textContent = era.name;
    svg.appendChild(text);
  });

  // 도시 마커
  const markers = {};
  cities.forEach(city => {
    const era = eraMap[city.era];
    if (!era) return;
    const cx = city.coord.x * SVG_W;
    const cy = city.coord.y * SVG_H;

    const g = svgEl('g', { class: 'city-marker', 'data-slug': city.slug, style: 'cursor:pointer' });

    const circle = svgEl('circle', { cx, cy, r: '7', fill: era.color, stroke: '#fff', 'stroke-width': '1.5' });
    const label = svgEl('text', {
      x: cx, y: cy + 18,
      'text-anchor': 'middle',
      fill: 'var(--c-text)',
      'font-size': '10',
      'font-family': 'var(--font-body)'
    });
    label.textContent = city.name;

    g.appendChild(circle);
    g.appendChild(label);
    svg.appendChild(g);
    markers[city.slug] = { g, circle };

    g.addEventListener('mouseenter', () => Store.setHover(city.slug));
    g.addEventListener('mouseleave', () => { Store.hoverCity = null; Store._emit('hover'); });
    g.addEventListener('click', () => Store.setActive(city.slug));
  });

  Store.subscribe((event, state) => {
    Object.entries(markers).forEach(([slug, { circle }]) => {
      const isHover = slug === state.hoverCity;
      const isActive = slug === state.activeCity;
      circle.setAttribute('r', isActive ? '11' : isHover ? '9' : '7');
      circle.setAttribute('stroke-width', isActive ? '3' : '1.5');
    });
  });

  if (cities.length > 0) Store.setActive(cities[0].slug);
});
