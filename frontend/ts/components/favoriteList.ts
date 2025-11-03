import StockStore from "../stores/stockStore";
import { StockEvent } from "../types";

export default class favoriteList {
    private select: HTMLSelectElement | null;
    
    constructor() {
        this.select = document.getElementById('symbolSelect') as HTMLSelectElement | null;
        this.listenToStockChanges();
    }

    // Met à jour l'option sélectionnée en fonction de StockStore
    private listenToStockChanges(): void {
        StockStore.onUpdate((stock: StockEvent) => {
            if (!stock) return;
            this.saveValueToList(stock);
        });
    }

    // Ajoute ou retire l'élément des favoris
    private addToFavorite(button: HTMLElement, event: Event): void {
        event.stopPropagation();
        console.log("Favori togglé !");
        button.classList.toggle('favorited');
    }
    // Supprime l'élément de la liste
    private deleteOption(button: HTMLElement, event: Event): void {
        event.stopPropagation();
        console.log("Élément supprimé !");
        const option = button.closest('option');
        if (option) option.remove();
    }

    // Ajoute une valeur dans la liste
    private saveValueToList(quote: StockEvent): void {
        if (!quote.shortName || quote.shortName.trim() === '') return;
        if (!this.select) return;

        const existingOption  = this.select.querySelector(`option[value="${quote.symbol}"]`) as HTMLOptionElement | null;

        if (existingOption) {
            this.selectOption(existingOption);
            return;
        }

        const template = document.getElementById("favorite-option-template") as HTMLTemplateElement;
        if (!template?.content) return;

        const clone = template.content.firstElementChild!.cloneNode(true) as HTMLOptionElement;
        clone.value = quote.symbol;
        clone.querySelector(".option-label")!.textContent = quote.shortName;

        this.select.appendChild(clone);
        this.selectOption(clone);

        const deleteBtn = clone.querySelector(".delete-button") as HTMLElement;
        const favoriteBtn = clone.querySelector(".favorite-button") as HTMLElement;

        // Événements
        deleteBtn.addEventListener("click", (event) => this.deleteOption(deleteBtn, event));
        favoriteBtn.addEventListener("click", (event) => this.addToFavorite(favoriteBtn, event));
        clone.addEventListener("click", () => this.onClick(clone));
    }

    // Gestion du clic sur une option
    private onClick(option: HTMLElement): void {
        if (!this.select) return;
        if (option.classList.contains('selected')) return;

        const value = (option as HTMLOptionElement).value;
        if (!value) return;

        this.selectOption(option);
        StockStore.setStock(value);
    }

    private selectOption(option: HTMLElement): void {
        if (!this.select) return;

        const selectedOption = this.select.querySelector('option.selected');
        if (selectedOption) selectedOption.classList.remove('selected');

        option.classList.add('selected');
    }
}
