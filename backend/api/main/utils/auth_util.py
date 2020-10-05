import os
import jwt
import requests
from flask_httpauth import HTTPTokenAuth
from cryptography.x509 import load_pem_x509_certificate
from cryptography.hazmat.backends import default_backend
from api.main.config import AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, AUTH0_CERT, LOGGER


class AuthService:
    @staticmethod
    def get_auth_token():
        url = os.path.join(AUTH0_DOMAIN, 'oauth/token/')
        payload = {
            "client_id": AUTH0_CLIENT_ID,
            "client_secret": AUTH0_CLIENT_SECRET,
            "audience": os.path.join(AUTH0_DOMAIN, 'api/v2/'),
            "grant_type": "client_credentials"
        }
        resp = requests.post(url, data=payload)
        token = resp.json().get('access_token')
        return token

    @staticmethod
    def get_user_token(username_or_email, password):
        url = os.path.join(AUTH0_DOMAIN, 'oauth/token/')
        payload = {
            "client_id": AUTH0_CLIENT_ID,
            "client_secret": AUTH0_CLIENT_SECRET,
            "audience": os.path.join(AUTH0_DOMAIN, 'api/v2/'),
            "username": username_or_email,
            "password": password,
            "grant_type": "password",
            "connection": "Username-Password-Authentication",
        }
        resp = requests.post(url, data=payload)
        return resp.json(), resp.status_code

    @staticmethod
    def decode_user_token(user_token):
        try:
            cert_obj = load_pem_x509_certificate(str.encode(AUTH0_CERT), default_backend())
            payload = jwt.decode(
                user_token,
                key=cert_obj.public_key(),
                algorithms="RS256",
                options={'verify_aud': False}
            )
            return {
                'status': 'success',
                'message': 'Valid token.',
                'user_id': payload['sub'].split('|')[1]
            }
        except jwt.ExpiredSignatureError:
            return {
                'status': 'fail',
                'message': 'Signature expired.'
            }
        except jwt.InvalidTokenError:
            return {
                'status': 'fail',
                'message': 'Invalid token.'
            }

    @staticmethod
    def create_user(user_id, username, password, email):
        auth_token = AuthService.get_auth_token()
        url = os.path.join(AUTH0_DOMAIN, 'api/v2/users')
        headers = {
            "Authorization": "Bearer " + auth_token
        }
        payload = {
            'user_id': user_id,
            'username': username,
            'password': password,
            'email': email,
            "connection": "Username-Password-Authentication",
        }
        resp = requests.post(url, headers=headers, data=payload)
        return resp.json(), resp.status_code

    @staticmethod
    def get_user(user_id):
        auth_token = AuthService.get_auth_token()
        url = os.path.join(AUTH0_DOMAIN, f'api/v2/users/auth0|{user_id}')
        headers = {
            "Authorization": "Bearer " + auth_token
        }
        resp = requests.get(url, headers=headers)
        return resp.json(), resp.status_code


TOKEN_AUTH = HTTPTokenAuth()


@TOKEN_AUTH.verify_token
def verify_token(auth_token):
    response = AuthService.decode_user_token(auth_token)
    LOGGER.info(response)
    if response['status'] == 'success':
        data = response['data']
        return data.get('sub').split('|')[1]
