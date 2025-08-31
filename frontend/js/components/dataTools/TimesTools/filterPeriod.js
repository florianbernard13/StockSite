import AbstractButton from "../../abstractButton.js";
import StockStore from "../../../stores/stockStore.js";

export default class FilterPeriod extends AbstractButton {
    /**
     * Crée un bouton de filtre de période.
     * @param {number} value - La quantité de temps (ex: 5).
     * @param {string} unit - L’unité de temps (ex: "d", "m", "y").
     * @param {string|null} mutuallyExclusiveGroup - Groupe exclusif.
     */
    constructor(value = 5, unit = "d", mutuallyExclusiveGroup = null) {
        const key = `last${value}${unit.toUpperCase()}`;
        super(key, {
            mutuallyExclusive: true,
            mutuallyExclusiveGroup: mutuallyExclusiveGroup,
        });
        this.value = value;
        this.unit = unit;
    }

    toggleState(originallyClickedButton) {
        if (this.isActive()) {
            this.onDeactivate(originallyClickedButton);
        } else {
            this.onActivate(originallyClickedButton);
        }
        this.button.classList.toggle("active");
        this.button.classList.toggle("inactive");
    }

    onActivate(originallyClickedButton) {
        if (this === originallyClickedButton) {
            StockStore.setTimeSpan(`${this.value}${this.unit}`);
        }
    }

    onDeactivate(originallyClickedButton) {
        if (this === originallyClickedButton) {
            StockStore.setTimeSpan(null);
        }
    }
}
