import Store from './sync.js';

document.addEventListener('data:ready', () => {
  const { eras, cities } = window.GovData;
  const el = document.getElementById('timeline');
  if (!el) return;

  const start = new Date('2025-01-01').getTime();
  const now = Date.now();
  const total = now - start;

  eras.forEach((era, i) => {
    const eraStart = new Date(era.from).getTime();
    const eraEnd = i + 1 < eras.length ? new Date(eras[i + 1].from).getTime() : now;
    const widthPct = ((eraEnd - eraStart) / total * 100).toFixed(2);

    const block = document.createElement('div');
    block.className = 'era-block';
    block.style.width = widthPct + '%';
    block.style.borderTop = `3px solid ${era.color}`;
    block.dataset.era = era.id;

    const label = document.createElement('span');
    label.className = 'era-label';
    label.textContent = era.name;
    block.appendChild(label);

    // 이 시대 도시들의 점
    const eraCities = cities.filter(c => c.era === era.id);
    eraCities.forEach(city => {
      const cityTime = new Date(city.founded).getTime();
      const posInEra = ((cityTime - eraStart) / (eraEnd - eraStart) * 100).toFixed(2);
      const dot = document.createElement('button');
      dot.className = 'era-dot';
      dot.style.left = posInEra + '%';
      dot.style.background = era.color;
      dot.title = city.name;
      dot.dataset.slug = city.slug;
      dot.addEventListener('mouseenter', () => Store.setHover(city.slug));
      dot.addEventListener('mouseleave', () => { Store.hoverCity = null; Store._emit('hover'); });
      dot.addEventListener('click', () => Store.setActive(city.slug));
      block.appendChild(dot);
    });

    el.appendChild(block);
  });

  Store.subscribe((event, state) => {
    el.querySelectorAll('.era-dot').forEach(dot => {
      const slug = dot.dataset.slug;
      dot.classList.toggle('is-hover', slug === state.hoverCity);
      dot.classList.toggle('is-active', slug === state.activeCity);
    });
  });
});
