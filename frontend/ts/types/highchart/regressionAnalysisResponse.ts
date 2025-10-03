export interface RegressionAnalysisResponse {
    regression: [string | number, number][];
    upper_bound_1: [string | number, number][];
    lower_bound_1: [string | number, number][];
    upper_bound_2: [string | number, number][];
    lower_bound_2: [string | number, number][];
}