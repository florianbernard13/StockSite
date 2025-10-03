import { StockEvent, StockHistoryEntry } from "../types";

type Listener = (stock: StockEvent) => void;

class StockStore {
    private static instance: StockStore;

    private symbol: string | null = null;
    private title: string | null = null;
    private data: StockHistoryEntry[] | null = null;
    private timeSpan: string | null = null;
    private listeners: Listener[] = [];

    private constructor() {}

    static getInstance(): StockStore {
        if (!StockStore.instance) {
            StockStore.instance = new StockStore();
        }
        return StockStore.instance;
    }

    setStock(symbol: string, title?: string, data?: StockHistoryEntry[]) {
        if (this.symbol === symbol) {
            if (title) this.title = title;
            if (data) this.data = data;
        } else {
            Object.assign(this, { symbol, title, data });
        }
        this.notifyListeners();
    }

    setTimeSpan(timeSpan: string | null) {
        this.timeSpan = timeSpan;
        this.notifyListeners();
    }

    getTimeSpan(): string | null {
        return this.timeSpan;
    }

    getApiUri(): string {
        if (!this.timeSpan) return "/stock_data?period=max";

        const regex = /^(\d+)([dmy])$/i;
        const match = this.timeSpan.match(regex);

        if (match) {
            const amount = match[1];
            const unit = match[2].toLowerCase();
            return `/stock_data/last/${amount}${unit}`;
        }

        return "/stock_data?period=max";
    }


    getStock(): StockEvent | null {
        if (!this.symbol) return null;
        return {
            symbol: this.symbol,
            shortName: this.title || "",
            history: this.data || []
        };
    }

    onUpdate(callback: Listener) {
        this.listeners.push(callback);
    }


    private notifyListeners() {
        const stock = this.getStock();
        if (!stock) return;
        this.listeners.forEach(callback => callback(stock));
    }
}

const stockStore = StockStore.getInstance();
export default stockStore;
