import 'bootstrap';
import StockSearch from "./stockSearch";
import StockDataFetcher from "./stockDataFetcher";
import favoriteList from "./components/favoriteList";
import DataTools from "./components/data_tools/dataTools";
import AnalysisDashboard from "./components/analysis_dashboard/analysisDashboard";

//TODO faire de slidePanel un vrai composant
import './components/panels/slidePanel';

document.addEventListener('DOMContentLoaded', () => {
    new StockSearch();
    const stockDataFetcher = new StockDataFetcher();
    new favoriteList();
    new DataTools(stockDataFetcher);
    new AnalysisDashboard();
});