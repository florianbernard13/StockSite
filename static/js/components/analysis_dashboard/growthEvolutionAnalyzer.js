import BaseAnalyzer from './baseAnalyzer.js';

export default class GrowthEvolutionAnalyzer extends BaseAnalyzer {
  constructor() {
    super('growth');
    this.type = 'growthEvolution';
  }

  _renderResult({ recent_growth_pct }) {
    // Structure only, fill logic when data available
    const text = recent_growth_pct != null ? `${recent_growth_pct.toFixed(2)} %` : 'n/a';
    return `<div><span class="pct">${text}</span></div>`;
  }
}