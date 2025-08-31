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
    if (!this.timeSpan) {
        // Pas de période spécifiée → récupérer toutes les données (max)
        return "/stock_data?period=max";
    }

    const regex = /^(\d+)([dmy])$/i;
    const match = this.timeSpan.match(regex);

    if (match) {
        const amount = match[1];
        const unit = match[2].toLowerCase();

        return `/stock_data/last/${amount}${unit}`;
    }

    // Si format invalide → fallback vers max
    return "/stock_data?period=max";
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
