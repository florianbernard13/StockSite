from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
import logging
import re
from zoneinfo import ZoneInfo
from pyrsistent import pvector
from app.models.price_series import PriceSeries
from app.models.quote import Quote

logger = logging.getLogger(__name__)
FR_ZONE = ZoneInfo("Europe/Paris")
TS_FORMAT = "%Y-%m-%d %H:%M:%S"


class PriceSeriesSlicer:

    @staticmethod
    def slice_quote_for_period(quote: Quote, period_str: str) -> PriceSeries | None:
        price_series = quote.price_series

        if not price_series or not price_series.prices:
            logger.warning("No price series available for symbol=%r", quote.symbol)
            return None

        parsed = PriceSeriesSlicer.parse_period(period_str)
        if parsed is None or parsed == "max":
            freq = "1d"
            sliced = quote.price_series
        else:
            num, unit = parsed
            cutoff_date = PriceSeriesSlicer.get_cutoff_date(num, unit)
            sliced = price_series.slice(start=cutoff_date)
            freq = PriceSeriesSlicer.get_resample_freq_from_parsed(num, unit)

        return PriceSeriesSlicer.resample_series(sliced, freq=freq)

    @staticmethod
    def get_cutoff_date(amount: int, unit: str) -> datetime | None:
        now = datetime.now(FR_ZONE)
        mapping = {
            'd': timedelta(days=amount),
            'm': relativedelta(months=amount),
            'y': relativedelta(years=amount),
        }
        delta = mapping.get(unit)
        if not delta:
            return None
        cutoff = now - delta
        cutoff_paris = cutoff.astimezone(FR_ZONE).replace(tzinfo=None)
        return cutoff_paris.strftime(TS_FORMAT)

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

    @staticmethod
    def resample_series(series: PriceSeries, freq: str = '1d') -> PriceSeries:
        """
        Sous-échantillonne une PriceSeries selon la fréquence désirée :
        - '1min' → 1 point par minute
        - '1h'   → 1 point par heure
        - '1d'   → 1 point par jour
        """
        if not series.prices:
            return PriceSeries.empty()

        result = [series.prices[0]]  # toujours garder le premier point
        last_key = PriceSeriesSlicer._get_key(series.prices[0][0], freq)

        for date_str, price in series.prices[1:]:
            key = PriceSeriesSlicer._get_key(date_str, freq)
            if key != last_key:
                result.append((date_str, price))
                last_key = key

        return PriceSeries(pvector(result))
    
    @staticmethod
    def _get_key(date_str: str, freq: str) -> str:
        """
        Retourne une clé string simplifiée selon la fréquence pour faire le resampling.
        """
        if freq == '1min':
            return date_str[:16]  # 'YYYY-MM-DD HH:MM'
        elif freq == '1h':
            return date_str[:13]  # 'YYYY-MM-DD HH'
        elif freq == '1d':
            return date_str[:10]  # 'YYYY-MM-DD'
        else:
            raise ValueError(f"Unknown freq: {freq}")
        
    @staticmethod
    def get_resample_freq_from_parsed(num: int, unit: str) -> str:
        if unit == 'd':
            if num <= 5:
                return '1min'
            if num <= 30:
                return '1h'
        elif unit == 'm' and num <= 1:
            return '1h'
        
        return '1d'