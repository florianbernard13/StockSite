from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
import logging
import re

from app.models.price_series import PriceSeries
from app.models.quote import Quote

logger = logging.getLogger(__name__)


class PriceSeriesSlicer:

    @staticmethod
    def slice_quote_for_period(quote: Quote, period_str: str) -> PriceSeries | None:
        price_series = quote.price_series

        if not price_series or not price_series.prices:
            logger.warning("No price series available for symbol=%r", quote.symbol)
            return None

        if period_str == "max":
            return price_series

        parsed = PriceSeriesSlicer.parse_period(period_str)
        if parsed is None:
            logger.warning("Invalid period format %r", period_str)
            return None

        amount, unit = parsed
        cutoff_date = PriceSeriesSlicer.get_cutoff_date(amount, unit)

        if cutoff_date is None:
            return None

        sliced = price_series.slice(start=cutoff_date)
        return sliced if sliced.prices else None

    @staticmethod
    def get_cutoff_date(amount: int, unit: str) -> datetime | None:
        now = datetime.now()
        mapping = {
            'd': timedelta(days=amount),
            'm': relativedelta(months=amount),
            'y': relativedelta(years=amount),
        }
        delta = mapping.get(unit)
        return now - delta if delta else None

    @staticmethod
    def parse_period(period_str: str):
        period_str = period_str.strip().lower()
        match = re.match(r"(\d+)\s*([a-z]+)", period_str)
        if not match:
            return None

        num = int(match.group(1))
        unit = match.group(2)

        if unit in ['d', 'day', 'days']:
            unit = 'd'
        elif unit in ['w', 'week', 'weeks']:
            unit = 'd'
            num *= 7
        elif unit in ['m', 'month', 'months']:
            unit = 'm'
        elif unit in ['y', 'year', 'years']:
            unit = 'y'
        else:
            return None

        return num, unit
