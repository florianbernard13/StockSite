import LinearRegressionAnalyzer from './linearRegressionAnalyzer.js';
import GrowthEvolutionAnalyzer from './growthEvolutionAnalyzer.js';

export default class AnalysisDashboard {
    constructor(endpoint = '/data_analyzers/analysis_dispatcher') {
        this.endpoint = endpoint;
        this.analyzers = [
            new LinearRegressionAnalyzer(),
            new GrowthEvolutionAnalyzer()
        ];
        this.bindEvents();
    }

    bindEvents() {
        const btn = document.getElementById('analyze-all-btn');
        if (btn) btn.addEventListener('click', () => this.analyzeAll());
    }

    _slugify(text) {
        return text.toLowerCase().replace(/[\.\/]/g, '-');
    }

    clearTable() {
        const tbody = document.querySelector('.stock-table tbody');
        if (tbody) tbody.innerHTML = '';
    }

    createRows(results) {
        const tbody = document.querySelector('.stock-table tbody');
        if (!tbody) return;

        results.forEach(item => {
            const symbol = item.symbol || item.symbol?.toString() || '';
            const name = item.name || '';

            const row = document.createElement('tr');
            row.setAttribute('data-ticker', symbol);

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

    createHeader() {
        const thead = document.querySelector('.stock-table thead');
        if (!thead) return;

        thead.innerHTML = '';
        const row = document.createElement('tr');

        const tickerTh = document.createElement('th');
        tickerTh.textContent = 'Ticker';
        row.appendChild(tickerTh);

        this.analyzers.forEach(analyzer => analyzer.addHeaderColumn(row));

        thead.appendChild(row);
    }

    async analyzeAll() {
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

            const results = await res.json();

            if (!Array.isArray(results) || results.length === 0) {
                const tbody = document.querySelector('.stock-table tbody');
                tbody.innerHTML = `<tr><td colspan="${this.analyzers.length + 1}" class="sigma--info">Aucun résultat retourné.</td></tr>`;
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
            const tbody = document.querySelector('.stock-table tbody');
            tbody.innerHTML = `<tr><td colspan="${this.analyzers.length + 1}" class="sigma--error">Erreur réseau lors du chargement.</td></tr>`;
        }
    }

    _sortErrorsToEnd(a, b) {
        const aErr = !!a.analysis?.error;
        const bErr = !!b.analysis?.error;
        return aErr === bErr ? 0 : aErr ? 1 : -1;
    }
}

