import { AnalysisResult } from '../../types';

export default abstract class BaseAnalyzer {
    protected prefix: string;
    protected label: string;
    public abstract type: string;

    constructor(prefix: string, label: string) {
        this.prefix = prefix;
        this.label = label;
    }

    public addHeaderColumn(theadRow: HTMLTableRowElement): void {
        const th = document.createElement('th');
        th.textContent = this.label;
        theadRow.appendChild(th);
    }

    public addBodyCell(row: HTMLTableRowElement, slug: string): void {
        const td = document.createElement('td');
        td.id = `${this.prefix}-${slug}`;
        td.innerHTML = '<span class="loading">En attente…</span>';
        row.appendChild(td);
    }

    public initCells(): void {
        document.querySelectorAll<HTMLTableCellElement>(`td[id^="${this.prefix}-"]`).forEach(td => {
            td.innerHTML = '<span class="loading">En attente d’analyse…</span>';
        });
    }

    public populateCell(item: AnalysisResult): void {
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

     protected _slugify(text: string): string {
        return text.toLowerCase().replace(/[\.\/]/g, '-');
    }

    protected _renderError(error: string): string {
        return `<span class="sigma--error">Erreur : ${error}</span>`;
    }

    protected _renderResult(analysis: any): string {
        return '';
    }
}
