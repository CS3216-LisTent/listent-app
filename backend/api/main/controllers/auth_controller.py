from flask import request
from flask_restplus import Resource, Namespace
from api.main.config import IMAGES_DIR
from api.main.services.users_service import UserService
from api.main.utils.auth_util import TOKEN_AUTH
from api.main.utils.file_util import save_file

API = Namespace(name='auth')


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
    @TOKEN_AUTH.login_required
    def post(self):
        user_token = TOKEN_AUTH.get_auth()['token']
        return UserService.logout_user(user_token)
