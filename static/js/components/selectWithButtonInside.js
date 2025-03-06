import StockStore from "../stores/stockStore.js";

export default class SelectWithButtonInside {
    constructor() {
        this.select = document.getElementById('symbolSelect');
        this.listenToStockChanges();
    }

    // Met à jour l'option sélectionnée en fonction de StockStore
    listenToStockChanges() {
        StockStore.onUpdate((stock) => {
            this.SaveValueToList(stock);
        });
    }

    // Ajoute ou retire l'élément des favoris
    AddToFavorite(button, event) {
        event.stopPropagation();
        console.log("Favori togglé !");
        button.classList.toggle('favorited');
    }

    // Supprime l'élément de la liste
    Delete(button, event) {
        event.stopPropagation();
        console.log("Élément supprimé !");
        button.closest('option').remove();
    }

    // Ajoute une valeur dans la liste
    SaveValueToList(quote) {
        if (!quote.title || quote.title.trim() === '') return;

        if (!this.select) return;

        const optionExists = this.select.querySelector(`option[value="${quote.symbol}"]`);
        if (!optionExists) {
            const optionHTML = `
                <option value="${quote.symbol}">
                    ${quote.title}
                    <button class="delete-button">x</button>
                    <button class="favorite-button">♥</button>
                </option>
            `;
            this.select.insertAdjacentHTML('beforeend', optionHTML);
            const newOption = this.select.querySelector(`option[value="${quote.symbol}"]`);
            this.SelectOption(newOption);

            // // Ajouter les événements
            newOption.addEventListener('click', (event) => this.OnClick(event.target));
            newOption.querySelector('.delete-button').addEventListener('click', (event) => this.Delete(event.target, event));
            // lastOption.querySelector('.favorite-button').addEventListener('click', (event) => this.cpntSwbiAddToFavorite(event.target, event));
        }
        else {
            this.SelectOption(optionExists);
        }
    }

    // Gestion du clic sur une option
    OnClick(option) {
        if (option.classList.contains('selected')) return;
        if (option.value === null) return;
        this.SelectOption(option);
        StockStore.setStock(option.value);
    }

    SelectOption(option) {
        const selectedOption = this.select.querySelector('option.selected');
        if (selectedOption) {
            selectedOption.classList.remove('selected');
        }
        option.classList.add('selected');
    }
}
