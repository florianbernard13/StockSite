export default class BaseAnalyzer {
  constructor(prefix) {
    this.prefix = prefix; // e.g. 'regression' or 'growth'
  }

  initCells() {
    document.querySelectorAll(`td[id^="${this.prefix}-"]`).forEach(td => {
      td.innerHTML = '<span class="loading">En attente d’analyse…</span>';
    });
  }

  populateCell(item) {
    const id = this._slugify(item.symbol);
    const cell = document.getElementById(`${this.prefix}-${id}`);
    if (!cell) return;
    if (item.analysis?.error) {
      cell.innerHTML = this._renderError(item.analysis.error);
    } else {
      cell.innerHTML = this._renderResult(item.analysis);
    }
  }

  _slugify(text) {
    return text.toLowerCase().replace(/[\.\/]/g, '-');
  }

  // to override:
  _renderError(error) {
    return `<span class="sigma--error">Erreur : ${error}</span>`;
  }
  _renderResult(analysis) {
    return '';
  }
}