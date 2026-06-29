import Store from './sync.js';

async function loadData() {
  const [eras, slugs] = await Promise.all([
    fetch('data/eras.json').then(r => r.json()),
    fetch('data/cities/index.json').then(r => r.json())
  ]);
  const cities = await Promise.all(
    slugs.map(slug => fetch(`data/cities/${slug}.json`).then(r => r.json()))
  );
  window.GovData = { eras, cities };
  document.dispatchEvent(new CustomEvent('data:ready'));
}

loadData().catch(err => console.error('GovData load failed:', err));
