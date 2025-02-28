export default class SelectWithButtonInside {
    constructor() {
        this.activated = null;
    }

    // Active une option et la marque comme sélectionnée
    cpntSwbiActivate(option) {
        console.log("cpnt_swbi_activate");
        if (this.activated) {
            this.activated.classList.remove('selected');
        }
        this.activated = option;
        this.activated.classList.add('selected');
    }

    // Ajoute ou retire l'élément des favoris
    cpntSwbiAddToFavorite(button, event) {
        event.stopPropagation();
        console.log("cpnt_swbi_add_to_favorite");
        button.classList.toggle('favorited');
    }

    // Supprime l'élément de la liste
    cpntSwbiDelete(button, event) {
        event.stopPropagation();
        console.log("cpnt_swbi_delete");
        button.closest('option').remove();
    }

    // Sauvegarde une valeur dans la liste
    cpntSwbiSaveValueToList(quote) {
        const optionExists = $('#symbolSelect option[value="' + quote.symbol + '"]').length > 0;
        if (!optionExists) {
            const select = document.getElementById('symbolSelect');
            const optionHTML = `
                <option value="${quote.symbol}">
                    ${quote.title}
                    <button class="delete-button">x</button>
                    <button class="favorite-button">♥</button>
                </option>
            `;
            select.insertAdjacentHTML('beforeend', optionHTML);
            const lastOption = select.lastElementChild;

            // Ajouter les événements pour les boutons de chaque option
            lastOption.querySelector('.delete-button').addEventListener('click', (event) => this.cpntSwbiDelete(event.target, event));
            lastOption.querySelector('.favorite-button').addEventListener('click', (event) => this.cpntSwbiAddToFavorite(event.target, event));

            // Activer la dernière option ajoutée
            this.cpntSwbiActivate(lastOption);
        }
    }

    // Gestion de l'événement de clic sur une option
    cpntSwbiOnClick(option) {
        if (option.classList.contains('selected')) return;
        site.symbol = option.value;
        site.GetQuote();
        this.cpntSwbiActivate(option);
    }

    // Méthode d'initialisation pour les événements
    init() {
        document.getElementById('symbolSelect').addEventListener('click', (event) => {
            const targetOption = event.target.closest('option');
            if (targetOption) {
                this.cpntSwbiOnClick(targetOption);
            }
        });
    }
}