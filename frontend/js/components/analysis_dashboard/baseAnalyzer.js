export default class BaseAnalyzer {
    constructor(prefix, label) {
        this.prefix = prefix;
        this.label = label;
    }

    addHeaderColumn(theadRow) {
        const th = document.createElement('th');
        th.textContent = this.label;
        theadRow.appendChild(th);
    }

    addBodyCell(row, slug) {
        const td = document.createElement('td');
        td.id = `${this.prefix}-${slug}`;
        td.innerHTML = '<span class="loading">En attente…</span>';
        row.appendChild(td);
    }

    initCells() {
        document.querySelectorAll(`td[id^="${this.prefix}-"]`).forEach(td => {
            td.innerHTML = '<span class="loading">En attente d’analyse…</span>';
        });
    }

    populateCell(item) {
        const id = this._slugify(item.symbol);
        const cell = document.getElementById(`${this.prefix}-${id}`);
        if (!cell) return;

        if (item.analysis?.error) {
            cell.innerHTML = this._renderError(item.analysis.error);
        } else if (item.analysis?.[this.type]) {
            console.log(item.analysis[this.type]);
            cell.innerHTML = this._renderResult(item.analysis[this.type]);
        } else {
            cell.innerHTML = this._renderError(`No analysis for type "${this.type}"`);
        }
    }

    _slugify(text) {
        return text.toLowerCase().replace(/[\.\/]/g, '-');
    }

    _renderError(error) {
        return `<span class="sigma--error">Erreur : ${error}</span>`;
    }

    _renderResult(analysis) {
        return '';
    }
}
