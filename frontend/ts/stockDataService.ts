import StockStore from "./stores/stockStore";

export default class StockDataService {

    async fetch(symbol: string) {

        if (StockStore.getTimeSpan() === "REALTIME") {
            return this.fetchRealtime(symbol);
        }

        return this.fetchHistory(symbol);
    }

    async fetchHistory(symbol: string) {

        const apiUri = StockStore.getApiUri();
        const symbolParam = (apiUri.includes("?") ? "&" : "?") + "symbol=" + symbol;

        const response = await fetch("/api" + apiUri + symbolParam, {
            method: "GET",
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error("Erreur réseau : " + response.status);
        }

        return response.json();
    }

    async fetchRealtime(symbol: string) {

        const response = await fetch(`/api/stock_data/realtime?symbol=${symbol}`, {
            method: "GET",
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error("Erreur réseau : " + response.status);
        }

        return response.json();
    }
}