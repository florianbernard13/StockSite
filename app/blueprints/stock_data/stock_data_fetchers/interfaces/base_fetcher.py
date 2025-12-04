from abc import ABC, abstractmethod

class BaseFetcher(ABC):
    @abstractmethod
    def getData():
        pass