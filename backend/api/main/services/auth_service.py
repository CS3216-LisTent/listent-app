import os
import requests
from api.main.db import DB
from api.main.config import AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET

class AuthService:
    @staticmethod
    def register_user(username, email, password):
        pass
        
    
    @staticmethod
    def login():
        pass

    @staticmethod
    def logout():
        pass

    @staticmethod
    def update_post():
        pass

    @staticmethod
    def delete_post():
        pass


class Auth0Service:
    @staticmethod
    def get_token():
        url = os.path.join(AUTH0_DOMAIN, 'oauth/token')
        payload = {
            "client_id": AUTH0_CLIENT_ID,
            "client_secret": AUTH0_CLIENT_SECRET,
            "audience": os.path.join(AUTH0_DOMAIN, 'api/v2'),
            "grant_type": "client_credentials"
        }
        resp = requests.post(url, data=payload)
        token = resp.json().get('access_token')
        return token