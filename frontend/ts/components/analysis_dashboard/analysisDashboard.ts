import LinearRegressionAnalyzer from './linearRegressionAnalyzer';
import GrowthEvolutionAnalyzer from './growthEvolutionAnalyzer';
import { AnalysisResult } from '../../types';
import AbstractButton from '../buttons/abstractButton'; 

export default class AnalysisDashboard {
    private endpoint: string;
    private analyzers: (LinearRegressionAnalyzer | GrowthEvolutionAnalyzer)[];
    private analyzeButton: AbstractButton;

    constructor(endpoint: string = '/data_analyzers/analysis_dispatcher') {
        this.endpoint = endpoint;
        this.analyzers = [
            new LinearRegressionAnalyzer(),
            new GrowthEvolutionAnalyzer()
        ];
        this.bindEvents();
    }

    private bindEvents(button: AbstractButton): void {
        const btn = document.getElementById('analyze-all-btn');
        if (btn) btn.addEventListener('click', () => this.analyzeAll());
    }

    private _slugify(text: string): string {
        return text.toLowerCase().replace(/[\.\/]/g, '-');
    }

    private clearTable(): void {
        const tbody = document.querySelector<HTMLTableSectionElement>('.stock-table tbody');
        if (tbody) tbody.innerHTML = '';
    }


    private createRows(results: AnalysisResult[]): void {
        const tbody = document.querySelector<HTMLTableSectionElement>('.stock-table tbody');
        if (!tbody) return;

        results.forEach(item => {
            const symbol = item.symbol || '';
            const name = item.name || '';

            const row = document.createElement('tr');
            row.dataset.ticker = symbol;

            const tickerCell = document.createElement('td');
            tickerCell.textContent = name;
            row.appendChild(tickerCell);

            this.analyzers.forEach(analyzer => {
                const slug = this._slugify(symbol);
                analyzer.addBodyCell(row, slug);
            });

            tbody.appendChild(row);
        });
    }

    private createHeader(): void {
        const thead = document.querySelector<HTMLTableSectionElement>('.stock-table thead');
        if (!thead) return;

        thead.innerHTML = '';
        const row = document.createElement('tr');

        const tickerTh = document.createElement('th');
        tickerTh.textContent = 'Ticker';
        row.appendChild(tickerTh);

        this.analyzers.forEach(analyzer => analyzer.addHeaderColumn(row));

        thead.appendChild(row);
    }

    public async analyzeAll(): Promise<void> {
        const analyses = this.analyzers.map(a => a.type);

        this.clearTable();

        try {
            const res = await fetch(this.endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tickers: [], analyses })
            });

            if (!res.ok) {
                const errBody = await res.json().catch(() => ({}));
                const message = errBody.error || `HTTP ${res.status}`;
                throw new Error(message);
            }

            const results: AnalysisResult[] = await res.json();

            if (!Array.isArray(results) || results.length === 0) {
                const tbody = document.querySelector<HTMLTableSectionElement>('.stock-table tbody');
                if (tbody) {
                    tbody.innerHTML = `<tr><td colspan="${this.analyzers.length + 1}" class="sigma--info">Aucun résultat retourné.</td></tr>`;
                }
                return;
            }

            results.sort(this._sortErrorsToEnd);

            this.createHeader();
            this.createRows(results);

            results.forEach(item => {
                this.analyzers.forEach(analyzer => analyzer.populateCell(item));
            });
        } catch (err) {
            console.error(err);
            const tbody = document.querySelector<HTMLTableSectionElement>('.stock-table tbody');
            if (tbody) {
                tbody.innerHTML = `<tr><td colspan="${this.analyzers.length + 1}" class="sigma--error">Erreur réseau lors du chargement.</td></tr>`;
            }
        }
    }

    private _sortErrorsToEnd(a: AnalysisResult, b: AnalysisResult): number {
        const aErr = !!a.analysis?.error;
        const bErr = !!b.analysis?.error;
        return aErr === bErr ? 0 : aErr ? 1 : -1;
    }
}

