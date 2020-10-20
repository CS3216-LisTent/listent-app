from flask import request, make_response, jsonify
from flask_restplus import Resource, Namespace
from api.main.config import IMAGES_DIR, LOGGER
from api.main.services.users_service import UserService
from api.main.utils.auth_util import TOKEN_AUTH
from api.main.utils.file_util import save_file, upload

API = Namespace(name='auth')


@API.route('/register', strict_slashes=False)
class AuthRegisterController(Resource):
    def post(self):
        try:
            LOGGER.info(f'Endpoint called: {request.method} {request.path}')
            register_info = {}
            if 'username' in request.form:
                register_info['username'] = request.form['username'].lower()
            if 'email' in request.form:
                register_info['email'] = request.form['email'].lower()
            if 'password' in request.form:
                register_info['password'] = request.form['password']
            if 'description' in request.form:
                register_info['description'] = request.form['description']
            if 'picture' in request.files:
                file = request.files['picture']
                picture = upload(file, file.filename)
                register_info['picture'] = picture
            return UserService.register_user(**register_info)
        except Exception as e:
            return make_response(jsonify({'status': 'fail', 'error': str(e)}), 500)


@API.route('/login', strict_slashes=False)
class UserLoginController(Resource):
    def post(self):
        try:
            LOGGER.info(f'Endpoint called: {request.method} {request.path}')
            login_info = {}
            if 'username' in request.json:
                login_info['username_or_email'] = request.json['username'].lower()
            elif 'email' in request.json:
                login_info['username_or_email'] = request.json['email'].lower()
            if 'password' in request.json:
                login_info['password'] = request.json['password']
            return UserService.login_user(**login_info)
        except Exception as e:
            return make_response(jsonify({'status': 'fail', 'error': str(e)}), 500)


@API.route('/logout', strict_slashes=False)
class UserLogoutController(Resource):
    @TOKEN_AUTH.login_required
    def post(self):
        try:
            LOGGER.info(f'Endpoint called: {request.method} {request.path}')
            user_token = TOKEN_AUTH.get_auth()['token']
            return UserService.logout_user(user_token)
        except Exception as e:
            return make_response(jsonify({'status': 'fail', 'error': str(e)}), 500)


@API.route('/change-password', strict_slashes=False)
class UserChangePassword(Resource):
    @TOKEN_AUTH.login_required
    def put(self):
        try:
            LOGGER.info(f'Endpoint called: {request.method} {request.path}')
            username = TOKEN_AUTH.current_user()
            change_password_info = {'username': username}
            if 'current_password' in request.json:
                change_password_info['current_password'] = request.json['current_password']
            if 'new_password' in request.json:
                change_password_info['new_password'] = request.json['new_password']
            return UserService.change_password(**change_password_info)
        except Exception as e:
            return make_response(jsonify({'status': 'fail', 'error': str(e)}), 500)


# @API.route('/change-email', strict_slashes=False)
# class UserChangePassword(Resource):
#     @TOKEN_AUTH.login_required
#     def put(self):
#         try:
#             LOGGER.info(f'Endpoint called: {request.method} {request.path}')
#             LOGGER.info(f'Request payload data: {request.json}')
#             username = TOKEN_AUTH.current_user()
#             new_email = request.json['new_email']
#             return UserService.change_email(username, new_email)
#         except Exception as e:
#             return make_response(jsonify({'status': 'fail', 'error': str(e)}), 500)


@API.route('/verify-email/<string:username>', strict_slashes=False)
class UserVerifyEmail(Resource):
    def post(self, username):
        try:
            LOGGER.info(f'Endpoint called: {request.method} {request.path}')
            return UserService.verify_user(username)
        except Exception as e:
            return make_response(jsonify({'status': 'fail', 'error': str(e)}), 500)


@API.route('/send-email-verification/<string:username>', strict_slashes=False)
class UserVerifyEmail(Resource):
    def post(self, username):
        try:
            LOGGER.info(f'Endpoint called: {request.method} {request.path}')
            return UserService.send_email_verification(username)
        except Exception as e:
            return make_response(jsonify({'status': 'fail', 'error': str(e)}), 500)
