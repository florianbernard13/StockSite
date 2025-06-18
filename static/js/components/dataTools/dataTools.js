// components/dataTools/dataTools.js
import FilterPeriod from "./TimesTools/filterPeriod.js";
import LinearRegression from "./DataAnalysisTools/linearRegression.js";
import MutuallyExclusiveButtons from "../mutuallyExclusiveButton.js";

export default class DataTools {
    constructor(stockDataFetcher) {
        const mutuallyExclusiveGroup = new MutuallyExclusiveButtons();

        new FilterPeriod(5, 'd', mutuallyExclusiveGroup);
        new FilterPeriod(15, 'd', mutuallyExclusiveGroup);
        new FilterPeriod(3, 'mo', mutuallyExclusiveGroup);
        new FilterPeriod(6, 'mo', mutuallyExclusiveGroup);
        new LinearRegression(stockDataFetcher);
    }
}
