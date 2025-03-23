// components/dataTools/dataTools.js
import FilterLastDays from "./TimesTools/filterLastDays.js";
import LinearRegression from "./DataAnalysisTools/linearRegression.js";
import MutuallyExclusiveButtons from "../mutuallyExclusiveButton.js";

export default class DataTools {
    constructor(stockDataFetcher) {
        const mutuallyExclusiveGroup = new MutuallyExclusiveButtons();

        new FilterLastDays(5, mutuallyExclusiveGroup);
        new FilterLastDays(15, mutuallyExclusiveGroup);
        new LinearRegression(stockDataFetcher);
    }
}
