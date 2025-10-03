import { DashStyleValue } from "highcharts";
import { RegressionAnalysisResponse } from "./regressionAnalysisResponse";

export interface RegressionAnalysisRender {
    key: keyof RegressionAnalysisResponse;
    name: string;
    color: string;
    dashStyle: DashStyleValue ;
}