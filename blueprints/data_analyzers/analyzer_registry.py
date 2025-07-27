ANALYZERS_REGISTRY = {}

def register_analyzer(cls):
    ANALYZERS_REGISTRY[cls.__name__] = cls
    return cls