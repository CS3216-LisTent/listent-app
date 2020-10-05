import uuid
from flask import jsonify, make_response
from api.main.utils.auth_util import AuthService


class UserService:
    @staticmethod
    def register_user(username, email, password):
        user_id = uuid.uuid4().hex
        user_data_resp, status_code = AuthService.create_user(
            user_id=user_id,
            username=username,
            email=email,
            password=password
        )
        if status_code == 201:
            user_token_resp, status_code = AuthService.get_user_token(
                username_or_email=username,
                password=password
            )
            if status_code == 200:
                user_token = user_token_resp['access_token']
                data = {
                    'user_id': user_id,
                    'username': user_data_resp['username'],
                    'email': user_data_resp['email'],
                    'user_token': user_token
                }
                return make_response(jsonify(data), status_code)
            else:
                return make_response(jsonify(user_token_resp), status_code)
        else:
            return make_response(jsonify(user_data_resp), status_code)

    @staticmethod
    def login_user(username_or_email, password):
        user_token_resp, status_code = AuthService.get_user_token(
            username_or_email=username_or_email,
            password=password
        )
        if status_code == 200:
            user_token = user_token_resp['access_token']
            decode_resp = AuthService.decode_user_token(user_token)
            if decode_resp['status'] == 'success':
                user_id = decode_resp['user_id']
                user_data_resp, status_code = AuthService.get_user(user_id)
                if status_code == 200:
                    data = {
                        'user_id': user_id,
                        'username': user_data_resp['username'],
                        'email': user_data_resp['email'],
                        'user_token': user_token
                    }
                    return make_response(jsonify(data), status_code)
                else:
                    return make_response(jsonify(user_data_resp), status_code)
            else:
                return make_response(jsonify(decode_resp), 400)
        else:
            return make_response(jsonify(user_token_resp), status_code)

    @staticmethod
    def logout():
        pass

    @staticmethod
    def update_post():
        pass

    @staticmethod
    def delete_post():
        pass



