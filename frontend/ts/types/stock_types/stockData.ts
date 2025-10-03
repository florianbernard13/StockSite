import { StockHistoryEntry } from "./stockHistoryEntry";

export interface StockData {
  symbol: string;
  shortName: string;
  price: number;
  history: StockHistoryEntry[];
}