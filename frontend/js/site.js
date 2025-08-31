import $ from 'jquery';
import 'bootstrap';
import Highcharts from 'highcharts/highstock.js';
import ExportingModule from 'highcharts/modules/exporting.js';
import ExportDataModule from 'highcharts/modules/export-data.js';
import AccessibilityModule from 'highcharts/modules/accessibility.js';

// Initialisation modules Highcharts
ExportingModule(Highcharts);
ExportDataModule(Highcharts);
AccessibilityModule(Highcharts);

// Tes imports JS natifs
import StockSearch from "./stockSearch.js";
import StockDataFetcher from "./stockDataFetcher.js";
import SelectWithButtonInside from "./components/selectWithButtonInside.js";
import DataTools from "./components/dataTools/dataTools.js";
import AnalysisDashboard from "./components/analysis_dashboard/analysisDashboard.js";

$(document).ready(() => {
    new StockSearch();
    const stockDataFetcher = new StockDataFetcher();
    new SelectWithButtonInside();
    new DataTools(stockDataFetcher);
    new AnalysisDashboard();
});