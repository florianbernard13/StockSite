import LinearRegressionAnalyzer from './linearRegressionAnalyzer';
import GrowthEvolutionAnalyzer from './growthEvolutionAnalyzer';
import { AnalysisResult } from '../../types';

export default class AnalysisDashboard {
    private endpoint: string;
    private analyzers: (LinearRegressionAnalyzer | GrowthEvolutionAnalyzer)[];
    private results: AnalysisResult[] = [];
    private sortKey: string | null = null;
    private sortDir: 'asc' | 'desc' = 'asc'

    constructor(endpoint: string = '/data_analyzers/analysis_dispatcher') {
        this.endpoint = endpoint;
        this.analyzers = [
            new LinearRegressionAnalyzer(),
            new GrowthEvolutionAnalyzer()
        ];
        this.bindEvents();
    }

    private bindEvents(): void {
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

        this.analyzers.forEach(analyzer => {
            const th = analyzer.addHeaderColumn(row);

            if ('getSortValue' in analyzer) {
                th.classList.add('sortable');
                th.dataset.sortKey = analyzer.type;
                th.addEventListener('click', () => {
                    this.toggleSort(analyzer.type);
                });
            }
        });

        thead.appendChild(row);
    }

    public async analyzeAll(): Promise<void> {
        const analyses = this.analyzers.map(a => a.type);

        this.createHeader();

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

            this.results = results.sort(this._sortErrorsToEnd);
            this.render();

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

    private render(): void {
        this.clearTable();
        this.createRows(this.getSortedResults());

        this.results.forEach(item => {
            this.analyzers.forEach(analyzer => analyzer.populateCell(item));
        });
    }

    private getSortedResults(): AnalysisResult[] {
        if (!this.sortKey) return this.results;

        const analyzer = this.analyzers.find(a => a.type === this.sortKey);
        if (!analyzer?.getSortValue) return this.results;

        const factor = this.sortDir === 'asc' ? 1 : -1;

        return [...this.results].sort((a, b) => {
            const va = analyzer.getSortValue!(a);
            const vb = analyzer.getSortValue!(b);

            if (va == null && vb == null) return 0;
            if (va == null) return 1;
            if (vb == null) return -1;

            if (typeof va === 'number' && typeof vb === 'number') {
                return (va - vb) * factor;
            }

            return String(va).localeCompare(String(vb)) * factor;
        });
    }

    private toggleSort(key: string): void {
        if (this.sortKey === key) {
            this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortKey = key;
            this.sortDir = 'asc';
        }
        this.updateSortIndicators();
        this.render();
    }

    private updateSortIndicators(): void {
        document.querySelectorAll<HTMLTableCellElement>('.stock-table th.sortable').forEach(th => {
            th.classList.remove('sort-asc', 'sort-desc');
            if (th.dataset.sortKey === this.sortKey) {
                th.classList.add(this.sortDir === 'asc' ? 'sort-asc' : 'sort-desc');
            }
        });
    }

    private _sortErrorsToEnd(a: AnalysisResult, b: AnalysisResult): number {
        const aErr = !!a.analysis?.error;
        const bErr = !!b.analysis?.error;
        return aErr === bErr ? 0 : aErr ? 1 : -1;
    }
}

