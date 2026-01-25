import { AnalysisResult } from "../../../types";

export interface SortableAnalyzer {
    getSortValue(result: AnalysisResult): number | string | null;
}