import { StockEvent } from "./stockEvent";
export interface StockStoreState {
    symbol: string | null;
    title: string | null;
    data: StockEvent[] | null;
}
