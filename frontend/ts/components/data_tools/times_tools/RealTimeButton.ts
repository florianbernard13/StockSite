import AbstractButton from "../../buttons/abstractButton";
import StockDataFetcher from "../../../stockDataFetcher";
import MutuallyExclusiveButtonGroup from "../../mutuallyExclusiveButtonGroup";
import StockStore from "../../../stores/stockStore";

export default class RealTimeButton extends AbstractButton {

    /**
     * @param stockDataFetcher - L'instance de StockDataFetcher à utiliser.
     */
    constructor(
        public stockDataFetcher: StockDataFetcher,
        mutuallyExclusiveGroup: MutuallyExclusiveButtonGroup | null = null) {
        super("realtime-btn", {
            mutuallyExclusive: true,
            mutuallyExclusiveGroup,
        });
        this.stockDataFetcher = stockDataFetcher;
    }

    protected onActivate() {
        StockStore.setTimeSpan("REALTIME")
    }

    protected onDeactivate(): void {
        StockStore.setTimeSpan(null);
    }
}