import BaseAnalyzer from './baseAnalyzer.js';

export default class LinearRegressionAnalyzer extends BaseAnalyzer {
    constructor() {
        super('regression', 'Régression Linéaire');
        this.type = 'linear_regression';
    }

    _renderResult({ actual, predicted, band }) {
        const pct = predicted !== 0 ? ((actual - predicted) / predicted) * 100 : null;
        const text = pct !== null ? `${pct.toFixed(2)} %` : 'n/a';
        const color = this._getBandColorClass(band);
        return `<div class="${color}"><span class="pct">${text}</span></div>`;
    }

    _getBandColorClass(band) {
        switch (band) {
            case 'between +2σ and +∞': return 'sigma--green-dark';
            case 'between +1σ and +2σ': return 'sigma--green';
            case 'between -1σ and +1σ': return 'sigma--neutral';
            case 'between -2σ and -1σ': return 'sigma--red';
            case 'between -∞ and -2σ': return 'sigma--red-dark';
            default: return 'sigma--unknown';
        }
    }
}
