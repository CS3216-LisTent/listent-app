from flask import request, make_response, jsonify
from flask_restplus import Resource, Namespace
from api.main.config import IMAGES_DIR
from api.main.services.posts_service import PostService
from api.main.services.users_service import UserService
from api.main.utils.auth_util import TOKEN_AUTH
from api.main.utils.file_util import save_file

API = Namespace(name='users')


@API.route('/', strict_slashes=False)
class UserController(Resource):
    @TOKEN_AUTH.login_required
    def get(self):
        try:
            username = TOKEN_AUTH.current_user()
            return UserService.get_user(username, auth_info=True)
        except Exception as e:
            return make_response(jsonify({'status': 'fail', 'error': str(e)}), 500)

    @TOKEN_AUTH.login_required
    def put(self):
        try:
            username = TOKEN_AUTH.current_user()
            updates = {}
            if request.form.get('description'):
                updates['description'] = request.form.get('description')
            if request.files.get('picture'):
                picture_file = request.files.get('picture')
                picture_filepath = save_file(IMAGES_DIR, picture_file)
                updates['picture_filepath'] = picture_filepath
            return UserService.update_user(username=username, **updates)
        except Exception as e:
            return make_response(jsonify({'status': 'fail', 'error': str(e)}), 500)


@API.route('/<string:username>', strict_slashes=False)
class OtherUserController(Resource):
    def get(self, username):
        try:
            return UserService.get_user(username, auth_info=False)
        except Exception as e:
            return make_response(jsonify({'status': 'fail', 'error': str(e)}), 500)


@API.route('/<string:username>/follow', strict_slashes=False)
class FollowController(Resource):
    @TOKEN_AUTH.login_required
    def post(self, username):
        try:
            curr_username = TOKEN_AUTH.current_user()
            return UserService.follow(curr_username, username)
        except Exception as e:
            return make_response(jsonify({'status': 'fail', 'error': str(e)}), 500)


@API.route('/<string:username>/unfollow', strict_slashes=False)
class UnFollowController(Resource):
    @TOKEN_AUTH.login_required
    def post(self, username):
        try:
            curr_username = TOKEN_AUTH.current_user()
            return UserService.unfollow(curr_username, username)
        except Exception as e:
            return make_response(jsonify({'status': 'fail', 'error': str(e)}), 500)


@API.route('/<string:username>/is-following', strict_slashes=False)
class UserFollowController(Resource):
    @TOKEN_AUTH.login_required
    def get(self, username):
        try:
            curr_username = TOKEN_AUTH.current_user()
            return UserService.is_following(curr_username, username)
        except Exception as e:
            return make_response(jsonify({'status': 'fail', 'error': str(e)}), 500)


@API.route('/<string:username>/posts', strict_slashes=False)
class UserPostsController(Resource):
    def get(self, username):
        try:
            skip = request.args.get('skip')
            skip = int(skip) if (skip and skip.isdigit()) else 0
            limit = request.args.get('limit')
            limit = int(limit) if (limit and limit.isdigit()) else 10
            return PostService.get_user_posts(username, skip=skip, limit=limit)
        except Exception as e:
            return make_response(jsonify({'status': 'fail', 'error': str(e)}), 500)


@API.route('/search', strict_slashes=False)
class UserSearchController(Resource):
    def get(self):
        try:
            search_info = {}
            if ('q' in request.args) and (request.args['q'] is not None):
                search_info['query'] = request.args['q']

            skip = request.args.get('skip')
            search_info['skip'] = int(skip) if (skip and skip.isdigit()) else 0
            limit = request.args.get('limit')
            search_info['limit'] = int(limit) if (limit and limit.isdigit()) else 10

            return UserService.search_user(**search_info)
        except Exception as e:
            return make_response(jsonify({'status': 'fail', 'error': str(e)}), 500)
