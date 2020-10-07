from auth0.v3 import Auth0Error
from flask import jsonify, make_response
from pymongo.errors import OperationFailure, ConnectionFailure

from api.main.models.user_model import UserModel
from api.main.utils.auth_util import AuthUtil


class UserService:
    @staticmethod
    def register_user(username, email, password):
        try:
            user_auth_data = AuthUtil.create_user(
                username=username,
                email=email,
                password=password
            )
            user_token = AuthUtil.get_user_token(
                    username_or_email=username,
                    password=password
            )
            user_app_data = UserModel.add_user(
                username=username
            )
            data = {
                'username': user_auth_data['username'],
                'email': user_auth_data['email'],
                'followers': user_app_data['followers'],
                'followings': user_app_data['followings'],
                'posts': user_app_data['posts'],
                'user_token': user_token
            }
            return make_response(
                jsonify({
                    'status': 'success',
                    'message': 'User successfully registered.',
                    'data': data
                }), 201
            )
        except Auth0Error as e:
            return make_response(
                jsonify({
                    'status': 'fail',
                    'message': f'Auth0 Error: {str(e)}',
                }), 400
            )
        except OperationFailure as e:
            return make_response(
                jsonify({
                    'status': 'fail',
                    'message': f'DB Operation Error: {str(e)}',
                }), 400
            )
        except ConnectionFailure as e:
            return make_response(
                jsonify({
                    'status': 'fail',
                    'message': f'DB Connection Error: {str(e)}',
                }), 500
            )

    @staticmethod
    def login_user(username_or_email, password):
        try:
            user_token = AuthUtil.get_user_token(
                username_or_email=username_or_email,
                password=password
            )
            username = AuthUtil.decode_user_token(user_token)
            user_auth_data = AuthUtil.get_user(username)
            user_app_data = UserModel.get_user(username)
            data = {
                'username': user_auth_data['username'],
                'email': user_auth_data['email'],
                'followers': user_app_data['followers'],
                'followings': user_app_data['followings'],
                'posts': user_app_data['posts'],
                'user_token': user_token
            }
            return make_response(
                jsonify({
                    'status': 'success',
                    'message': 'User successfully login.',
                    'data': data
                }), 200
            )
        except Auth0Error as e:
            return make_response(
                jsonify({
                    'status': 'fail',
                    'message': f'Auth0 Error: {str(e)}',
                }), 400
            )
        except OperationFailure as e:
            return make_response(
                jsonify({
                    'status': 'fail',
                    'message': f'DB Operation Error: {str(e)}',
                }), 400
            )
        except ConnectionFailure as e:
            return make_response(
                jsonify({
                    'status': 'fail',
                    'message': f'DB Connection Error: {str(e)}',
                }), 500
            )

    @staticmethod
    def logout_user(user_token):
        AuthUtil.blacklist_user_token(user_token)
        return make_response(
                jsonify({
                    'status': 'success',
                    'message': 'Successfully logout',
                }), 200
            )

    @staticmethod
    def get_user(username, auth_info=True):
        try:
            data = {'username': username}
            user_app_data = UserModel.get_user(username)
            data.update({
                'username': username,
                'followers': user_app_data['followers'],
                'followings': user_app_data['followings'],
                'posts': user_app_data['posts'],
                'number_of_followers': len(user_app_data['followers']),
                'number_of_following': len(user_app_data['followings']),
                'number_of_posts': len(user_app_data['posts']),
                'description': user_app_data['description'],
                'profile_picture': user_app_data['profile_picture'],
            })
            if auth_info:
                user_auth_data = AuthUtil.get_user(username)
                data.update({
                    'email': user_auth_data['email'],
                })
            return make_response(
                jsonify({
                    'status': 'success',
                    'message': 'User successfully retrieved.',
                    'data': data
                }), 200
            )
        except Auth0Error as e:
            return make_response(
                jsonify({
                    'status': 'fail',
                    'message': f'Auth0 Error: {str(e)}',
                }), 400
            )
        except OperationFailure as e:
            return make_response(
                jsonify({
                    'status': 'fail',
                    'message': f'DB Operation Error: {str(e)}',
                }), 400
            )
        except ConnectionFailure as e:
            return make_response(
                jsonify({
                    'status': 'fail',
                    'message': f'DB Connection Error: {str(e)}',
                }), 500
            )

    @staticmethod
    def follow(username, other_username):
        try:
            user_app_data = UserModel.follow(username, other_username)[0]
            user_auth_data = AuthUtil.get_user(username)
            data = {
                'username': user_auth_data['username'],
                'email': user_auth_data['email'],
                'followers': user_app_data['followers'],
                'followings': user_app_data['followings'],
                'posts': user_app_data['posts'],
            }
            return make_response(
                jsonify({
                    'status': 'success',
                    'message': f'{username} successfully followed {other_username}.',
                    'data': data
                }), 200
            )
        except Auth0Error as e:
            return make_response(
                jsonify({
                    'status': 'fail',
                    'message': f'Auth0 Error: {str(e)}',
                }), 400
            )
        except OperationFailure as e:
            return make_response(
                jsonify({
                    'status': 'fail',
                    'message': f'DB Operation Error: {str(e)}',
                }), 400
            )
        except ConnectionFailure as e:
            return make_response(
                jsonify({
                    'status': 'fail',
                    'message': f'DB Connection Error: {str(e)}',
                }), 500
            )

    @staticmethod
    def is_following(username, other_username):
        try:
            res = UserModel.is_following(username, other_username)
            message_verb = 'follows' if res else 'does not follow'

            return make_response(
                jsonify({
                    'status': 'success',
                    'message': f'{username} {message_verb} {other_username}.',
                    'data': res
                }), 200
            )
        except OperationFailure as e:
            return make_response(
                jsonify({
                    'status': 'fail',
                    'message': f'DB Operation Error: {str(e)}',
                }), 400
            )
        except ConnectionFailure as e:
            return make_response(
                jsonify({
                    'status': 'fail',
                    'message': f'DB Connection Error: {str(e)}',
                }), 500
            )
