import AbstractButton from "../../abstractButton.js";
import StockStore from "../../../stores/stockStore.js";

export default class FilterLastDays extends AbstractButton {
    constructor(days = 5, mutuallyExclusiveGroup = null) {
        super(`last${days}Days`, {
            mutuallyExclusive: true,  // Activation du mode mutuellement exclusif
            mutuallyExclusiveGroup: mutuallyExclusiveGroup,
        });
        this.days = days;
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
        if(this === originallyClickedButton) {
            StockStore.setTimeSpan(`${this.days}d`);

        }
    }

    onDeactivate(originallyClickedButton) {
        if(this === originallyClickedButton) {
        StockStore.setTimeSpan(null);
        }
    }
}
