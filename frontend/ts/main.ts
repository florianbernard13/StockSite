import 'bootstrap';
import StockSearch from "../js/stockSearch";
import StockDataFetcher from "../js/stockDataFetcher";
import SelectWithButtonInside from "../js/components/selectWithButtonInside";
import DataTools from "../js/components/dataTools/dataTools";
import AnalysisDashboard from "../js/components/analysis_dashboard/analysisDashboard";

document.addEventListener('DOMContentLoaded', () => {
    new StockSearch();
    const stockDataFetcher = new StockDataFetcher();
    new SelectWithButtonInside();
    new DataTools(stockDataFetcher);
    new AnalysisDashboard();
});