import StockSearch from "./stockSearch.js";
import StockDataFetcher from "./stockDataFetcher.js";
import SelectWithButtonInside from "./components/selectWithButtonInside.js";
import DataTools from "./components/dataTools/dataTools.js";

$(document).ready(() => {
    new StockSearch();  // Écoute la recherche
    const stockDataFetcher = new StockDataFetcher();  // Gère le graphique
    new SelectWithButtonInside();
    new DataTools(stockDataFetcher);  // Gère la liste des actions
});

