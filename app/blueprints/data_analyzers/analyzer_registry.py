ANALYZERS_REGISTRY = {}

def register_analyzer(cls):
    name = getattr(cls, 'analyzer_name', cls.__name__)
    ANALYZERS_REGISTRY[name] = cls
    return cls