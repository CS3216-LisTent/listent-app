import os
import jwt
import requests
from auth0.v3 import Auth0Error
from flask_httpauth import HTTPTokenAuth
from cryptography.x509 import load_pem_x509_certificate
from cryptography.hazmat.backends import default_backend
from api.main.config import AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, AUTH0_CERT, LOGGER


class AuthUtil:
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
        resp_data = resp.json()
        if resp.status_code == 200:
            token = resp_data.get('access_token')
            return token
        raise Auth0Error(
            status_code=resp.status_code,
            error_code=resp_data.get('errorCode'),
            message=f'Error in retrieving application access token. {resp_data.get("message", "")}'
        )

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
        resp_data = resp.json()
        if resp.status_code == 200:
            token = resp_data['access_token']
            return token
        raise Auth0Error(
            status_code=resp.status_code,
            error_code=resp_data.get('errorCode'),
            message=f'Error in retrieving user access token. {resp_data}'
        )

    @staticmethod
    def decode_user_token(user_token):
        cert_obj = load_pem_x509_certificate(str.encode(AUTH0_CERT), default_backend())
        payload = jwt.decode(
            user_token,
            key=cert_obj.public_key(),
            algorithms="RS256",
            options={'verify_aud': False}
        )
        sub = payload['sub'].split('|')[1]
        return sub

    @staticmethod
    def create_user(username, password, email):
        auth_token = AuthUtil.get_auth_token()
        url = os.path.join(AUTH0_DOMAIN, 'api/v2/users')
        headers = {
            'Authorization': 'Bearer ' + auth_token
        }
        payload = {
            'user_id': username,
            'username': username,
            'password': password,
            'email': email,
            "connection": "Username-Password-Authentication",
        }
        resp = requests.post(url, headers=headers, data=payload)
        resp_data = resp.json()
        if resp.status_code == 201:
            user_info = {
                'username': username,
                'email': email,
            }
            return user_info
        raise Auth0Error(
            status_code=resp.status_code,
            error_code=resp_data.get('errorCode'),
            message=f'Error creating user. {resp_data}'
        )

    @staticmethod
    def get_user(username):
        auth_token = AuthUtil.get_auth_token()
        url = os.path.join(AUTH0_DOMAIN, f'api/v2/users/auth0|{username}')
        headers = {
            "Authorization": "Bearer " + auth_token
        }
        resp = requests.get(url, headers=headers)
        resp_data = resp.json()
        if resp.status_code == 200:
            user_info = {
                'username': username,
                'email': resp_data['email']
            }
            return user_info
        raise Auth0Error(
            status_code=resp.status_code,
            error_code=resp_data.get('errorCode'),
            message=f'Error retrieving user. {resp_data}'
        )


TOKEN_AUTH = HTTPTokenAuth()


@TOKEN_AUTH.verify_token
def verify_token(auth_token):
    try:
        username = AuthUtil.decode_user_token(auth_token)
        return username
    except:
        return None
