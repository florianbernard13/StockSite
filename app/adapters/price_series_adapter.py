from app.models.price_series import PriceSeries
import pandas as pd
from zoneinfo import ZoneInfo

FR_ZONE = ZoneInfo("Europe/Paris")
TS_FORMAT = "%Y-%m-%d %H:%M:%S"

class PriceSeriesAdapter:

    @staticmethod
    def from_yfinance(df: pd.DataFrame, *, column: str = "Close") -> PriceSeries:
        series = PriceSeries.empty()

        for date, row in df.iterrows():
            dt = date.astimezone(FR_ZONE)
            ts_str = dt.replace(tzinfo=None).strftime(TS_FORMAT)
            price = float(row[column])
            series = series.add(ts_str, price)

        return series
