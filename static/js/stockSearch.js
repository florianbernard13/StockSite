import StockStore from "./stores/stockStore.js";

export default class StockSearch {
    constructor() {
        this.resultsBox = null;
        this.init();
    }

    init() {
        const form = document.getElementById('stockSearchForm');
        if (form) {
            form.addEventListener('submit', (event) => {
                event.preventDefault();
                const symbol = $("#symbol").val().trim();
                if (!symbol) return;

                console.log("Recherche de :", symbol);

                // Mettre à jour le StockStore (cela déclenchera la mise à jour du graphique)
                StockStore.setStock(symbol, null, null);
            });
        }
        this.setupAutocomplete();
    }

    setupAutocomplete() {
        const input = document.getElementById('symbol');
        this.resultsBox = document.getElementById('autocomplete-symbol');
    
        if (!input || !this.resultsBox) return;
    
        input.addEventListener('input', async () => {
            const query = input.value.trim();
            if (query.length < 1) {
                this.resultsBox.innerHTML = '';
                return;
            }
    
            try {
                const response = await fetch(`/api/stock_search/autocomplete?q=${encodeURIComponent(query)}`);
                const data = await response.json();
                this.renderSuggestions(data, input);
            } catch (err) {
                console.error('Erreur de requête autocomplete :', err);
            }
        });
    
        document.addEventListener('click', () => {
            this.resultsBox.innerHTML = '';
        });
    }


    renderSuggestions(data, input) {
        this.resultsBox.innerHTML = '';

        data.forEach(item => {
            const option = document.createElement('a');
            option.href = '#';
            option.classList.add('list-group-item', 'list-group-item-action');
            option.textContent = `${item.name} (${item.ticker})`;

            option.addEventListener('click', e => {
                e.preventDefault();
                input.value = item.ticker;
                this.resultsBox.innerHTML = '';
            });

            this.resultsBox.appendChild(option);
        });
    }
}
