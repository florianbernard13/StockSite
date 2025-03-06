import StockSearch from "./stockSearch.js";
import StockDataFetcher from "./stockDataFetcher.js";
import SelectWithButtonInside from "./components/selectWithButtonInside.js";
import DataTools from "./components/dataTools/dataTools.js";

$(document).ready(() => {
    new StockSearch();  // Écoute la recherche
    new StockDataFetcher();  // Gère le graphique
    new SelectWithButtonInside();
    new DataTools();  // Gère la liste des actions
});

