import uuid
from auth0.v3 import Auth0Error
from botocore.exceptions import ClientError
from flask import jsonify, make_response
from pymongo.errors import OperationFailure, ConnectionFailure
from api.main.models.users_model import UserModel
from api.main.utils.auth_util import AuthUtil
from api.main.utils.file_util import upload_file


class UserService:
    @staticmethod
    def register_user(username, email, password, description=None, picture=None):
        try:

            # Add to MongoDB
            user_db_data = UserModel.add_user(
                username=username,
                email=email,
                description=description,
                picture=picture
            )

            # Add to Auth0
            user_auth_data = AuthUtil.create_user(
                username=username,
                email=email,
                password=password
            )

            rtn_user_data = {
                'username': user_auth_data['username'],
                'email': user_auth_data['email'],
                'email_verified': user_auth_data['email_verified'],
                'followers': user_db_data['followers'],
                'followings': user_db_data['followings'],
                'posts': user_db_data['posts'],
                'number_of_followers': len(user_db_data['followers']),
                'number_of_following': len(user_db_data['followings']),
                'number_of_posts': len(user_db_data['posts']),
                'description': user_db_data['description'],
                'picture': user_db_data['picture'],
            }
            return make_response(
                jsonify({
                    'status': 'success',
                    'message': 'User successfully registered.',
                    'data': rtn_user_data
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
        except ClientError as e:
            return make_response(
                jsonify({
                    'status': 'fail',
                    'message': f'S3 Connection Error: {str(e)}',
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
            if user_auth_data['email_verified']:
                user_app_data = UserModel.get_user(username)
                data = {
                    'username': user_auth_data['username'],
                    'email': user_auth_data['email'],
                    'email_verified': user_auth_data['email_verified'],
                    'followers': user_app_data['followers'],
                    'followings': user_app_data['followings'],
                    'posts': user_app_data['posts'],
                    'number_of_followers': len(user_app_data['followers']),
                    'number_of_following': len(user_app_data['followings']),
                    'number_of_posts': len(user_app_data['posts']),
                    'description': user_app_data['description'],
                    'picture': user_auth_data['picture'],
                    'user_token': user_token
                }
                return make_response(
                    jsonify({
                        'status': 'success',
                        'message': 'User successfully login.',
                        'data': data
                    }), 200
                )
            else:
                return make_response(
                    jsonify({
                        'status': 'fail',
                        'message': 'User email not verified. Please verify email to login.',
                    }), 400
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
    def change_password(username, current_password, new_password):
        try:
            AuthUtil.get_user_token(
                username_or_email=username,
                password=current_password
            )
            data = AuthUtil.update_user(username, password=new_password)
            return make_response(
                jsonify({
                    'status': 'success',
                    'message': 'Password successfully changed.',
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

    # @staticmethod
    # def change_email(username, new_email):
    #     try:
    #         data = AuthUtil.update_user(username, email=new_email)
    #         AuthUtil.send_email_verification(username)
    #         return make_response(
    #             jsonify({
    #                 'status': 'success',
    #                 'message': 'Email successfully changed. Please verify your email again',
    #                 'data': data
    #             }), 200
    #         )
    #     except Auth0Error as e:
    #         return make_response(
    #             jsonify({
    #                 'status': 'fail',
    #                 'message': f'Auth0 Error: {str(e)}',
    #             }), 400
    #         )

    @staticmethod
    def send_email_verification(username):
        try:
            AuthUtil.send_email_verification(username)
            return make_response(
                jsonify({
                    'status': 'success',
                    'message': 'Email Verification sent.'
                }), 201
            )
        except Auth0Error as e:
            return make_response(
                jsonify({
                    'status': 'fail',
                    'message': f'Auth0 Error: {str(e)}',
                }), 400
            )

    @staticmethod
    def verify_user(username):
        try:
            data = AuthUtil.update_user(username, email_verified=True)
            return make_response(
                jsonify({
                    'status': 'success',
                    'message': 'User successfully verified.',
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


    @staticmethod
    def get_user(username, auth_info=True):
        try:
            user_data = UserModel.get_user(username)
            data = {'username': username}
            data.update({
                'followers': user_data['followers'],
                'followings': user_data['followings'],
                'posts': user_data['posts'],
                'number_of_followers': len(user_data['followers']),
                'number_of_following': len(user_data['followings']),
                'number_of_posts': len(user_data['posts']),
                'description': user_data['description'],
                'picture': user_data['picture'],
            })
            if auth_info:
                data.update({
                    'email': user_data['email']
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
    def update_user(username, **updates):
        try:
            if ('picture_filepath' in updates) and (updates['picture_filepath'] is not None):
                updates['picture'] = upload_file(updates['picture_filepath'], uuid.uuid4().hex)
            # user_auth_data = AuthUtil.update_user(username, **updates)
            user_app_data = UserModel.update_user(username, **updates)
            data = {
                'username': username,
                'email': user_app_data['email'],
                'followers': user_app_data['followers'],
                'followings': user_app_data['followings'],
                'posts': user_app_data['posts'],
                'number_of_followers': len(user_app_data['followers']),
                'number_of_following': len(user_app_data['followings']),
                'number_of_posts': len(user_app_data['posts']),
                'description': user_app_data['description'],
                'picture': user_app_data['picture'],
            }
            return make_response(
                jsonify({
                    'status': 'success',
                    'message': 'User successfully updated.',
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
        except ClientError as e:
            return make_response(
                jsonify({
                    'status': 'fail',
                    'message': f'S3 Connection Error: {str(e)}',
                }), 500
            )

    @staticmethod
    def follow(username, other_username):
        try:
            user_app_data = UserModel.follow(username, other_username)[0]
            data = {
                'username': user_app_data['_id'],
                'email': user_app_data['email'],
                'followers': user_app_data['followers'],
                'followings': user_app_data['followings'],
                'posts': user_app_data['posts'],
            }
            return make_response(
                jsonify({
                    'status': 'success',
                    'message': f'Successfully followed {other_username}.',
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
    def unfollow(username, other_username):
        try:
            user_app_data = UserModel.unfollow(username, other_username)[0]
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
                    'message': f'Successfully followed {other_username}.',
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

    @staticmethod
    def search_user(query='', skip=0, limit=10):
        try:
            users = [] if query == '' else UserModel.search_user(query=query, skip=skip, limit=limit)
            return make_response(
                jsonify({
                    'status': 'success',
                    'message': f'Successfully retrieved users.',
                    'data': users
                }), 200
            )
        except OperationFailure as e:
            return make_response(
                jsonify({
                    'status': 'success',
                    'message': f'Successfully retrieved users.',
                    'data': []
                }), 200
            )
        except ConnectionFailure as e:
            return make_response(
                jsonify({
                    'status': 'fail',
                    'message': f'DB Connection Error: {str(e)}',
                }), 500
            )