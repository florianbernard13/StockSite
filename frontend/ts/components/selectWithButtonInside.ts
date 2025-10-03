import StockStore from "../stores/stockStore";
import { StockEvent } from "../types";

export default class SelectWithButtonInside {
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

    // TODO: réécrire cette fonction
    // Ajoute une valeur dans la liste
    private saveValueToList(quote: StockEvent): void {
        // if (!quote.title || quote.title.trim() === '') return;
        // if (!this.select) return;

        // const optionExists = this.select.querySelector(`option[value="${quote.symbol}"]`) as HTMLOptionElement | null;
        // if (!optionExists) {
        //     const optionHTML = `
        //         <option value="${quote.symbol}">
        //             ${quote.title}
        //             <button class="delete-button">x</button>
        //             <button class="favorite-button">♥</button>
        //         </option>
        //     `;
        //     this.select.insertAdjacentHTML('beforeend', optionHTML);
        //     const newOption = this.select.querySelector(`option[value="${quote.symbol}"]`) as HTMLOptionElement;
        //     this.selectOption(newOption);

        //     // Ajouter les événements
        //     const deleteBtn = newOption.querySelector('.delete-button') as HTMLElement | null;
        //     const favoriteBtn = newOption.querySelector('.favorite-button') as HTMLElement | null;

        //     newOption.addEventListener('click', (event) => this.onClick(event.target as HTMLElement));
        //     deleteBtn?.addEventListener('click', (event) => this.deleteOption(event.target as HTMLElement, event));
        //     favoriteBtn?.addEventListener('click', (event) => this.addToFavorite(event.target as HTMLElement, event));
        // } else {
        //     this.selectOption(optionExists);
        // }
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
