import FilterPeriod from "./times_tools/filterPeriod";
import LinearRegression from "./data_analysis_tools/linearRegression";
import MutuallyExclusiveButtonGroup from "../mutuallyExclusiveButtonGroup";
import StockDataFetcher from "../../stockDataFetcher";

export default class DataTools {
    constructor(stockDataFetcher: StockDataFetcher) {
        const mutuallyExclusiveButtonGroup = new MutuallyExclusiveButtonGroup();

        new FilterPeriod(5, 'd', mutuallyExclusiveButtonGroup);
        new FilterPeriod(15, 'd', mutuallyExclusiveButtonGroup);
        new FilterPeriod(3, 'm', mutuallyExclusiveButtonGroup);
        new FilterPeriod(6, 'm', mutuallyExclusiveButtonGroup);

        new LinearRegression(stockDataFetcher);
    }
}
