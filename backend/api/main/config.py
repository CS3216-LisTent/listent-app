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

# S3 Bucket
BUCKET_NAME = 'listent'

IMAGES_DIR = os.path.join(BASEDIR, 'images')
AUDIO_DIR = os.path.join(BASEDIR, 'audio')


AUTH0_DOMAIN = 'https://dev-idomqow8.us.auth0.com'
AUTH0_CLIENT_ID = 'vEY8DZ6U24fv43INbpvkosUkYyYNqSQP'
AUTH0_CLIENT_SECRET = 'A3fc13WkE8iwhETfqKzmp2Dy-DE9eVH5dy-cCUB9DGAZpOtBSXZwjq65ZWDCFPXa'

AUTH0_CERT = '''
-----BEGIN CERTIFICATE-----
MIIDDTCCAfWgAwIBAgIJO1UnwvCrfBdYMA0GCSqGSIb3DQEBCwUAMCQxIjAgBgNV
BAMTGWRldi1pZG9tcW93OC51cy5hdXRoMC5jb20wHhcNMjAxMDAyMDkwNDQ5WhcN
MzQwNjExMDkwNDQ5WjAkMSIwIAYDVQQDExlkZXYtaWRvbXFvdzgudXMuYXV0aDAu
Y29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAnixnpzQdEmJwNFy1
aNZGsGkHyaPMOYkq3BMvP25WH5JHC40cl3apDaPlEge3YiUMSi6/8bNqqHNErZ/v
DUi2gCmlthGY74M8bEMffXjlaiLDCPPBO4cIgTLpqoZsVc9lgxTiRN/LhmpGCeKP
CvBhL5LoOMiSmcYEq9jZ6nynUmxRqKvrXM2yLFXMxZHiyiNa7EGkluPq/wenwdcH
+4rKFPA/k7w72vcFfCtCk3B+IhP97qJgXsf5+BzSfu3M9L7P3LPSVTxOvuSufgXm
+gL+Ts2aul1DDT6GAtP8P/QZxIomHfnBv2HR8YUmiVEzL5NZq6izCumCvOhFdygq
dxPyAQIDAQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBRYMQ3cy+9x
3T3mmfW2FpHbGGFEPjAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEB
AFK3CtLu5Sq1x2e3R9YFsx4o+RVT+ZjZikIKmmuoVQCVVGW+5OpSeLEXgdVNCewl
doxltxfVd/oV5tpiv/GA9dbfVFSpGZjRpqPgMV83EdrktMX3HZtKxyLsUcD6Wy7y
t7g3FYzgMtUeFZHFi2Zmdk4S3gaf8l1ZwkIC91nNEHWaJE8Y7XNil/+6MIkkbvpr
VtMOl0CoB/QbMSbxS55aecXhs9GLHLhyglWZkH+gaivJkObzog/J2HdRd02qSo+7
Xk7HyuYj+eMEbpNcmAD9r4Bvq26mQ3yaiZy17ILWmQah0tpdV1DyiqrN9E9S+PHe
P21Zv6DudI1c8u553gQO4ZE=
-----END CERTIFICATE-----
'''


def get_connection_url(env):
    if env == 'dev':
        return 'mongodb://127.0.0.1:27017'
    if env == 'test':
        return os.environ.get('DB_TEST_URL')
    if env == 'prod':
        return os.environ.get('DB_PROD_URL')


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
