from flask import request
from flask_restplus import Resource, Namespace, fields

from api import IMAGES_DIR
from api.main.services.users_service import UserService
from api.main.utils.auth_util import TOKEN_AUTH
from api.main.utils.file_util import save_file

API = Namespace(name='auth')

# USER_REGISTER_DATA = API.model(
#     "User register data", {
#         "username": fields.String(description="username", example="johndoe123", required=True),
#         "email": fields.String(description="email", example="johndoe@gmail.com", required=True),
#         "password": fields.String(description="password", example='password1', required=True)
#         }
# )
#
# USER_LOGIN_DATA = API.model(
#     "User login data", {
#         "username": fields.String(description="username", example="johndoe123", required=True),
#         "password": fields.String(description="password", example='password1', required=True)
#         }
# )


@API.route('/register', strict_slashes=False)
class AuthRegisterController(Resource):
    def post(self):
        username = request.form.get('username')
        password = request.form.get('password')
        email = request.form.get('email')
        description = request.form.get('description')
        picture_file = request.files.get('picture')
        picture_filepath = save_file(IMAGES_DIR, picture_file) if picture_file else None
        return UserService.register_user(
            username=username,
            password=password,
            email=email,
            description=description,
            picture_filepath=picture_filepath
        )


@API.route('/login', strict_slashes=False)
class UserLoginController(Resource):
    def post(self):
        username_or_email = request.json.get('username') or request.json.get('email')
        password = request.json.get('password')
        return UserService.login_user(
            username_or_email=username_or_email,
            password=password
        )


@API.route('/logout', strict_slashes=False)
class UserLogoutController(Resource):
    def post(self):
        user_token = TOKEN_AUTH.get_auth()['token']
        return UserService.logout_user(user_token)
