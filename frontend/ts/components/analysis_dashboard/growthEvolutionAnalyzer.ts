import BaseAnalyzer from './baseAnalyzer';
import { GrowthEvolutionAnalysis } from '../../types';

export default class GrowthEvolutionAnalyzer extends BaseAnalyzer {
    public type = 'growth_evolution';

    constructor() {
        super('growth', 'Growth Evolution');
    }

    protected _renderResult(analysis: GrowthEvolutionAnalysis): string {
        return `<div><span class="pct">${analysis.total_delta_pct}</span></div>`;
    }
}