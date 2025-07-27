// File: AnalysisDashboard.js
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

    extractTickers() {
        const rows = document.querySelectorAll('.stock-table tbody tr');
        const tickers = [];

        rows.forEach(row => {
            const cell = row.querySelector('td');
            if (cell) {
                const ticker = cell.textContent.trim();
                if (ticker) tickers.push(ticker);
            }
        });
        return tickers;
    }

    bindEvents() {
        const btn = document.getElementById('analyze-all-btn');
        if (btn) btn.addEventListener('click', () => this.analyzeAll());
    }

    async analyzeAll() {
        const tbody = document.querySelector('.stock-table tbody');
        if (!tbody) return;

        this.analyzers.forEach(analyzer => analyzer.initCells());

        const tickers = this.extractTickers();
        const analyses = this.analyzers.map(analyzer => analyzer.type);

        try {
            const res = await fetch(this.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ tickers, analyses })
            });

            const results = await res.json();
            results.sort(this._sortErrorsToEnd);

            results.forEach(item => {
                this.analyzers.forEach(analyzer => analyzer.populateCell(item));
            });
        } catch (err) {
            console.error(err);
            tbody.innerHTML = `<tr><td colspan="${this.analyzers.length + 1}" class="sigma--error">Erreur réseau lors du chargement.</td></tr>`;
        }
    }


    _sortErrorsToEnd(a, b) {
        const aErr = !!a.analysis?.error;
        const bErr = !!b.analysis?.error;
        return aErr === bErr ? 0 : aErr ? 1 : -1;
    }
}
