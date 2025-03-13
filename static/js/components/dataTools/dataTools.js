// 

import FilterLastDays from "./TimesTools/filterLastDays.js"
import LinearRegression from "./DataAnalysisTools/linearRegression.js"
import stockStore from "../../stores/stockStore.js"

export default class DataTools{
	constructor(stockDataFetcher) {
		new FilterLastDays(5);
		new FilterLastDays(15);
		new LinearRegression(stockDataFetcher);
    }
}