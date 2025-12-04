import os

class Config:
    DEBUG = True

class DevelopmentConfig(Config):
    ENV = 'development'
    DEBUG = True
    VITE_DEV_SERVER = "http://localhost:5173"

class ProductionConfig(Config):
    ENV = 'production'
    DEBUG = False
    VITE_DEV_SERVER = None