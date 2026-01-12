import logging
import warnings
import pandas as pd

def setup_logging():
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )

    logging.getLogger('werkzeug').setLevel(logging.WARNING)

    warnings.filterwarnings("ignore",category=FutureWarning,module="pandas")
    warnings.filterwarnings("ignore", category=FutureWarning, module="yfinance.*")
    warnings.simplefilter("ignore", pd.errors.SettingWithCopyWarning)
