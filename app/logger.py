import logging
import warnings

def setup_logging():
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )

    logging.getLogger('werkzeug').setLevel(logging.WARNING)

    warnings.filterwarnings(
        "ignore",
        category=FutureWarning,
        module="pandas"
    )
