from flask import request
from flask_restplus import Resource, Namespace, fields

from api.main.services.user_service import UserService

API = Namespace(name='User', path='/')

USER_REGISTER_DATA = API.model(
    "User register data", {
        "username": fields.String(description="username", example="johndoe123", required=True),
        "email": fields.String(description="email", example="johndoe@gmail.com", required=True),
        "password": fields.String(description="password", example='password1', required=True)
        }
)

USER_LOGIN_DATA = API.model(
    "User login data", {
        "username": fields.String(description="username", example="johndoe123", required=True),
        "password": fields.String(description="password", example='password1', required=True)
        }
)


@API.route('/register', strict_slashes=False)
class AuthRegisterController(Resource):
    @API.expect(USER_REGISTER_DATA)
    def post(self):
        data = request.json
        return UserService.register_user(
            username=data.get('username'),
            password=data.get('password'),
            email=data.get('email'),
        )


@API.route('/login', strict_slashes=False)
class UserLoginController(Resource):
    @API.expect(USER_LOGIN_DATA)
    def post(self):
        username_or_email = request.json.get('username') or request.json.get('email')
        password = request.json.get('password')
        return UserService.login_user(
            username_or_email=username_or_email,
            password=password
        )

