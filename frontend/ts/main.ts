import 'bootstrap';
import StockSearch from "./stockSearch";
import StockDataFetcher from "./stockDataFetcher";
import SelectWithButtonInside from "./components/selectWithButtonInside";
import DataTools from "./components/data_tools/dataTools";
import AnalysisDashboard from "./components/analysis_dashboard/analysisDashboard";

//TODO faire de slidePanel un vrai composant
import './components/panels/slidePanel';

document.addEventListener('DOMContentLoaded', () => {
    new StockSearch();
    const stockDataFetcher = new StockDataFetcher();
    new SelectWithButtonInside();
    new DataTools(stockDataFetcher);
    new AnalysisDashboard();
});