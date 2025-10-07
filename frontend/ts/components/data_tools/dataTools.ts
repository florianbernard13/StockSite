import FilterPeriodButton from "./times_tools/filterPeriodButton";
import LinearRegression from "./data_analysis_tools/linearRegression";
import MutuallyExclusiveButtonGroup from "../mutuallyExclusiveButtonGroup";
import StockDataFetcher from "../../stockDataFetcher";

export default class DataTools {
    constructor(stockDataFetcher: StockDataFetcher) {
        const mutuallyExclusiveButtonGroup = new MutuallyExclusiveButtonGroup();

        new FilterPeriodButton(5, 'd', mutuallyExclusiveButtonGroup);
        new FilterPeriodButton(15, 'd', mutuallyExclusiveButtonGroup);
        new FilterPeriodButton(3, 'm', mutuallyExclusiveButtonGroup);
        new FilterPeriodButton(6, 'm', mutuallyExclusiveButtonGroup);

        new LinearRegression(stockDataFetcher);
    }
}
