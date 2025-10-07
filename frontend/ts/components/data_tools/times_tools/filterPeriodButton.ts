import MutuallyExclusiveButtonGroup from "../../mutuallyExclusiveButtonGroup";
import AbstractButton from "../../abstractButton";
import StockStore from "../../../stores/stockStore";

export default class FilterPeriodButton extends AbstractButton {
    value: number;
    unit: string;

    /**
     * Crée un bouton de filtre de période.
     * @param value - La quantité de temps (ex: 5)
     * @param unit - L’unité de temps (ex: "d", "m", "y")
     * @param mutuallyExclusiveGroup - Groupe mutuellement exclusif
     */
    constructor(
        value: number = 5,
        unit: "d" | "m" | "y" = "d",
        mutuallyExclusiveGroup: MutuallyExclusiveButtonGroup | null = null
    ) {
        const key = `last${value}${unit.toUpperCase()}`;
        super(key, {
            mutuallyExclusive: true,
            mutuallyExclusiveGroup,
        });

        this.value = value;
        this.unit = unit;
    }

    toggleState(originallyClickedButton?: FilterPeriodButton): void {
        console.log("Toggle filter button");
        if (!this.button) return;
        if (this.isActive()) {
            this.onDeactivate(originallyClickedButton);
        } else {
            this.onActivate(originallyClickedButton);
        }
        this.button.classList.toggle("active");
        this.button.classList.toggle("inactive");
    }

    onActivate(originallyClickedButton?: FilterPeriodButton): void {
        console.log(this);
        console.log(originallyClickedButton);
        if (this === originallyClickedButton) {
            StockStore.setTimeSpan(`${this.value}${this.unit}`);
        }
    }

    onDeactivate(originallyClickedButton?: FilterPeriodButton): void {
        if (this === originallyClickedButton) {
            StockStore.setTimeSpan(null);
        }
    }
}
