class StockStore {
    constructor() {
        if (!StockStore.instance) {
            this.symbol = null;
            this.title = null;
            this.data = null;
            this.timeSpan = null
            this.listeners = [];
            StockStore.instance = this;
        }
        return StockStore.instance;
    }

    setStock(symbol, title, data) {
        if (this.symbol === symbol) {
            if (title) this.title = title;
            if (data) this.data = data;
        } else {
            Object.assign(this, { symbol, title, data });
        }
        this.notifyListeners();
    }

    setTimeSpan(timeSpan) {
        this.timeSpan = timeSpan;
        this.notifyListeners();
    }

    getTimeSpan(){
        return this.timeSpan
    }

    getApiUri() {
        // Vérifie si 'timeSpan' est valide (ex: "5d", "10d", etc.)
        const days = parseInt(this.timeSpan, 10);
    
        if (!isNaN(days)) {
            return `/stock_data/last_days/${days}`;
        }
    
        return "/stock_data";
    }

    getStock() {
        return {
            symbol: this.symbol,
            title: this.title,
            data: this.data
        };
    }

    onUpdate(callback) {
        this.listeners.push(callback);
    }

    notifyListeners() {
        this.listeners.forEach(callback => callback(this.getStock()));
    }
}

const instance = new StockStore();
export default instance;
