import StockStore from "./stores/stockStore.js";

export default class StockSearch {
    constructor() {
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
    }
}
