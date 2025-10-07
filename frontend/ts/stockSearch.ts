import StockStore from "./stores/stockStore";
import { StockItem } from "./types";

export default class StockSearch {
    private resultsBox: HTMLElement | null;
    constructor() {
        this.resultsBox = null;
        this.init();
    }

    private init(): void {
        const form = document.getElementById('stockSearchForm') as HTMLFormElement | null;
        if (form) {
            form.addEventListener('submit', (event: Event) => {
                event.preventDefault();
                const symbolInput = document.getElementById("symbol") as HTMLInputElement | null
                const symbol = symbolInput?.value.trim();
                if (!symbol) return;

                console.log("Recherche de :", symbol);

                // Pousse uniquement le nom de l'action à tous les listeners
                StockStore.setStock(symbol, undefined, undefined);
            });
        }
        this.setupAutocomplete();
    }

    private setupAutocomplete(): void {
        const input = document.getElementById('symbol') as HTMLInputElement | null;
        this.resultsBox = document.getElementById('autocomplete-symbol');
    
        if (!input || !this.resultsBox) return;
    
        input.addEventListener('input', async () => {
            const query = input.value.trim();
            if (query.length < 1) {
                this.clearResults();
                return;
            }
    
            try {
                const response = await fetch(`/api/stock_search/autocomplete?q=${encodeURIComponent(query)}`);
                const data: StockItem[] = await response.json();
                this.renderSuggestions(data, input);
            } catch (err) {
                console.error('Erreur de requête autocomplete :', err);
            }
        });
    
        document.addEventListener('click', () => {
            this.clearResults();
        });
    }


    private renderSuggestions(data: StockItem[], input: HTMLInputElement): void {
        this.clearResults();

        data.forEach(item => {
            const option = document.createElement('a');
            option.href = '#';
            option.classList.add('list-group-item', 'list-group-item-action');
            option.textContent = `${item.name} (${item.ticker})`;

            option.addEventListener('click', e => {
                e.preventDefault();
                input.value = item.ticker;
                this.clearResults();
            });

            this.resultsBox?.appendChild(option);
        });
    }

    private clearResults(): void {
        if (this.resultsBox) {
            this.resultsBox.innerHTML = '';
        }
    }
}
