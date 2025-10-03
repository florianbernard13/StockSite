import { StockHistoryEntry } from "./stockHistoryEntry";

export interface StockEvent {
  symbol: string;
  shortName: string;
  history: StockHistoryEntry[];
}