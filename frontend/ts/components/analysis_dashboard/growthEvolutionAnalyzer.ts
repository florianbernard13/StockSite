import BaseAnalyzer from './baseAnalyzer';
import { GrowthEvolutionAnalysis } from '../../types';
import { AnalysisResult } from '../../types';
import { SortableAnalyzer } from './interfaces/sortableAnalyzer';

export default class GrowthEvolutionAnalyzer extends BaseAnalyzer implements SortableAnalyzer{
    public type = 'growth_evolution';

    constructor() {
        super('growth', 'Growth Evolution');
    }

    getSortValue(result: AnalysisResult): number | null {
        const analysis = result.analysis?.[this.type];
        if (!analysis) return null;

        return analysis.total_delta_pct ?? null;
    }

    protected _renderResult(analysis: GrowthEvolutionAnalysis): string {
        return `<div><span class="pct">${analysis.total_delta_pct}</span></div>`;
    }
}