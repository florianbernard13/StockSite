import BaseAnalyzer from './baseAnalyzer';
import { LinearRegressionAnalysis } from '../../types';
import { AnalysisResult } from '../../types';
import { SortableAnalyzer } from './interfaces/sortableAnalyzer';

export default class LinearRegressionAnalyzer extends BaseAnalyzer implements SortableAnalyzer {
    public type = 'linear_regression';

    constructor() {
        super('regression', 'Régression Linéaire');
    }

    getSortValue(result: AnalysisResult): number | null {
        const analysis = result.analysis?.[this.type];
        if (!analysis || analysis.predicted === 0) return null;

        return ((analysis.actual - analysis.predicted) / analysis.predicted) * 100;
    }

    protected _renderResult(analysis: LinearRegressionAnalysis): string {
        const pct = analysis.predicted !== 0 ? ((analysis.actual - analysis.predicted) / analysis.predicted) * 100 : null;
        const text = pct !== null ? `${pct.toFixed(2)} %` : 'n/a';
        const color = this._getBandColorClass(analysis.band);
        return `<div class="${color}"><span class="pct">${text}</span></div>`;
    }

    private _getBandColorClass(band: string): string {
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
