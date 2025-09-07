import 'bootstrap';

import StockSearch from "./stockSearch.js";
import StockDataFetcher from "./stockDataFetcher.js";
import SelectWithButtonInside from "./components/selectWithButtonInside.js";
import DataTools from "./components/dataTools/dataTools.js";
import AnalysisDashboard from "./components/analysis_dashboard/analysisDashboard.js";

document.addEventListener('DOMContentLoaded', () => {
    new StockSearch();
    const stockDataFetcher = new StockDataFetcher();
    new SelectWithButtonInside();
    new DataTools(stockDataFetcher);
    new AnalysisDashboard();
});