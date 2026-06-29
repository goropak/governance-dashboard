const Store = {
  activeCity: null,
  hoverCity: null,
  _subs: [],
  subscribe(fn) { this._subs.push(fn); },
  _emit(event) { this._subs.forEach(fn => fn(event, this)); },
  setHover(slug) { this.hoverCity = slug; this._emit('hover'); },
  setActive(slug) {
    this.activeCity = (this.activeCity === slug) ? null : slug;
    this._emit('active');
  },
  clear() { this.activeCity = null; this.hoverCity = null; this._emit('clear'); }
};
export default Store;
