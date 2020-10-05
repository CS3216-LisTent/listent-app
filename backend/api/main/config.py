import os
import logging

BASEDIR = os.path.abspath(os.path.dirname(__file__))
ENV = os.environ.get('ENV', 'dev')

# JWT Secret Key
SECRET_KEY = os.environ.get('SECRET_KEY', 'secret')

# # IMGUR Credentials
# IMGUR_CLIENT_ID = os.environ['IMGUR_CLIENT_ID']
# IMGUR_CLIENT_SECRET = os.environ['IMGUR_CLIENT_ID']

# # DB Credentials
# DB_USER = os.environ["DB_USER"]
# DB_PASSWORD = os.environ["DB_PASSWORD"]
# DB_NAME = os.environ["DB_NAME"]
# SQL_CONNECTION_NAME = os.environ["SQL_CONNECTION_NAME"]


AUTH0_DOMAIN = 'https://dev-idomqow8.us.auth0.com'
AUTH0_CLIENT_ID = 'vEY8DZ6U24fv43INbpvkosUkYyYNqSQP'
AUTH0_CLIENT_SECRET = 'A3fc13WkE8iwhETfqKzmp2Dy-DE9eVH5dy-cCUB9DGAZpOtBSXZwjq65ZWDCFPXa'


def get_connection_url(env):
    if env == 'dev':
        return 'mongodb://127.0.0.1:27017'
    if env == 'test':
        # Remote database
        pass
    if env == 'prod':
        # Remote database
        pass


MONGO_CONNECTION_URL = get_connection_url(ENV)
DB_NAME = 'listent'


# Setup Logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s: %(levelname)s - %(message)s')
LOGGER = logging.getLogger(__name__)


class Config:
    WTF_CSRF_CHECK_DEFAULT = False
    WTF_CSRF_ENABLED = False
    DEBUG = False
    PRESERVE_CONTEXT_ON_EXCEPTION = False


class DevelopmentConfig(Config):
    DEBUG = True


class TestingConfig(Config):
    DEBUG = False
    TESTING = True


class ProductionConfig(Config):
    DEBUG = False


config_by_name = dict(
    dev=DevelopmentConfig,
    test=TestingConfig,
    prod=ProductionConfig
)
