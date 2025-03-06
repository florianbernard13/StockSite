import StockStore from "../../../stores/stockStore.js";

export default class FilterLastDays {
    constructor(days = 5) {
        this.days = days;  // Nombre de jours à afficher
        this.lastDaysButton = document.getElementById(`last${days}Days`);
        if(!this.lastDaysButton) return;

        // Ajout d'un écouteur d'événement sur le bouton
        this.lastDaysButton.addEventListener("click", () => this.onClick());
    }

    onClick() {
        this.lastDaysButton.classList.toggle("active");
        this.lastDaysButton.classList.toggle("inactive");
        if (this.lastDaysButton.classList.contains("active")) {
            StockStore.setTimeSpan(`${this.days}d`);
        } else {
            StockStore.setTimeSpan(null);
        }
    }
}
