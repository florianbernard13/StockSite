from app.models.price_series import PriceSeries

class PriceSeriesAdapter:

    @staticmethod
    def from_yfinance(df, *, column: str = "Close") -> PriceSeries:
        series = PriceSeries.empty()

        for date, row in df.iterrows():
            price = float(row[column])
            dt = date.to_pydatetime()
            dt = dt.replace(tzinfo=None)
            series = series.add(dt, price)

        return series
