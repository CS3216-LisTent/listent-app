import os
import logging

ENV = os.environ.get('ENV', 'dev')

BASEDIR = os.path.abspath(os.path.dirname(__file__))
IMAGES_DIR = os.path.join(BASEDIR, 'images')
AUDIO_DIR = os.path.join(BASEDIR, 'audio')

# JWT Secret Key
SECRET_KEY = os.environ.get('SECRET_KEY')

# S3 Bucket
BUCKET_NAME = os.environ.get('S3_BUCKET_NAME')

# Auth0
AUTH0_CERT = os.path.join(BASEDIR, 'cert.pem')
AUTH0_DOMAIN = os.environ.get('AUTH0_DOMAIN')
AUTH0_CLIENT_ID = os.environ.get('AUTH0_CLIENT_ID')
AUTH0_CLIENT_SECRET = os.environ.get('AUTH0_CLIENT_SECRET')


def get_connection_url(env):
    if env == 'dev':
        return 'mongodb://127.0.0.1:27017'
    if env == 'test':
        return os.environ.get('MONGODB_CONNECTION')
    if env == 'prod':
        return os.environ.get('MONGODB_CONNECTION')


MONGO_CONNECTION_URL = get_connection_url(ENV)
DB_NAME = os.environ.get('MONGODB_DB_NAME')

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
