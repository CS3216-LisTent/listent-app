import os
import jwt
import requests
from auth0.v3 import Auth0Error
from flask import make_response, jsonify
from flask_httpauth import HTTPTokenAuth
from cryptography.x509 import load_pem_x509_certificate
from cryptography.hazmat.backends import default_backend
from api.main.config import AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, AUTH0_CERT, LOGGER
from api.main.db import DB


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
            message=f'Error in retrieving application access token. {resp_data}'
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
        with open(AUTH0_CERT, 'r') as f:
            certstr = f.read()
        cert_obj = load_pem_x509_certificate(str.encode(certstr), default_backend())
        payload = jwt.decode(
            user_token,
            key=cert_obj.public_key(),
            algorithms="RS256",
            options={'verify_aud': False}
        )
        sub = payload['sub'].split('|')[1]
        return sub

    @staticmethod
    def blacklist_user_token(user_token):
        DB.blacklisted_tokens.save({'token': user_token})

    @staticmethod
    def create_user(username, password, email, picture=None):
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
        if picture:
            payload['picture'] = picture
        resp = requests.post(url, headers=headers, data=payload)
        resp_data = resp.json()
        if resp.status_code == 201:
            user_info = {
                'username': resp_data['username'],
                'email': resp_data['email'],
                'email_verified': resp_data['email_verified'],
                'picture': resp_data['picture']
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
                'username': resp_data['username'],
                'email': resp_data['email'],
                'email_verified': resp_data['email_verified'],
                'picture': resp_data['picture']
            }
            return user_info
        raise Auth0Error(
            status_code=resp.status_code,
            error_code=resp_data.get('errorCode'),
            message=f'Error retrieving user. {resp_data}'
        )

    @staticmethod
    def update_user(username, **updates):
        auth_token = AuthUtil.get_auth_token()
        url = os.path.join(AUTH0_DOMAIN, f'api/v2/users/auth0|{username}')
        headers = {
            'Authorization': 'Bearer ' + auth_token
        }
        payload = {}
        if ('picture' in updates) and (updates['picture'] is not None):
            payload['picture'] = updates['picture']
        resp = requests.patch(url, headers=headers, data=payload)
        resp_data = resp.json()
        if resp.status_code == 200:
            user_info = {
                'username': resp_data['username'],
                'email': resp_data['email'],
                'picture': resp_data['picture']
            }
            return user_info
        raise Auth0Error(
            status_code=resp.status_code,
            error_code=resp_data.get('errorCode'),
            message=f'Error creating user. {resp_data}'
        )


TOKEN_AUTH = HTTPTokenAuth()


@TOKEN_AUTH.verify_token
def verify_token(user_token):
    try:
        is_blacklisted = DB.blacklisted_tokens.find_one({'token': user_token})
        if not is_blacklisted:
            username = AuthUtil.decode_user_token(user_token)
            user_auth_data = AuthUtil.get_user(username)
            if user_auth_data['email_verified']:
                return username
    except:
        return None


@TOKEN_AUTH.error_handler
def token_auth_error(status):
    return make_response(jsonify({
        'status': 'fail',
        'message': 'Unauthorized user token. Please login again.'
    }), status)
