import BaseAnalyzer from './baseAnalyzer.js';

export default class GrowthEvolutionAnalyzer extends BaseAnalyzer {
  constructor() {
    super('growth');
    this.type = 'growth_evolution';
  }

  _renderResult({ amplitude, deltas, deltas_pct, total_delta_pct, instability, volatility, volatility_pct}) {
    // Structure only, fill logic when data available
    return `<div><span class="pct">${total_delta_pct}</span></div>`;
  } 
}