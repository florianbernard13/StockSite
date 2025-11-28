import AbstractButton from "../../buttons/abstractButton";
import StockDataFetcher from "../../../stockDataFetcher";
import MutuallyExclusiveButtonGroup from "../../mutuallyExclusiveButtonGroup";

export default class RealTimeButton extends AbstractButton {
    stockDataFetcher;

    /**
     * @param stockDataFetcher - L'instance de StockDataFetcher à utiliser.
     */
    constructor(
        stockDataFetcher: StockDataFetcher,
        mutuallyExclusiveGroup: MutuallyExclusiveButtonGroup | null = null) {
        super("realtime-btn", {
            mutuallyExclusive: true,
            mutuallyExclusiveGroup,
        });
        this.stockDataFetcher = stockDataFetcher;
    }

    protected onActivate() {
        this.fetchRealTimeData();
    }

    async fetchRealTimeData() {
        try {
            console.log("Fetching real-time data...");
            const data = await this.stockDataFetcher.fetchRealTimeData();
            console.log("Real-time data received:", data);
        } catch (error) {
            console.error("Erreur lors de la récupération des données temps réel :", error);
        }
    }
}