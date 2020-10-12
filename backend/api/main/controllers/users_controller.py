from flask import request
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
        username = TOKEN_AUTH.current_user()
        return UserService.get_user(username, auth_info=True)

    @TOKEN_AUTH.login_required
    def put(self):
        username = TOKEN_AUTH.current_user()
        updates = {}
        if request.form.get('description'):
            updates['description'] = request.form.get('description')
        if request.files.get('picture'):
            picture_file = request.files.get('picture')
            picture_filepath = save_file(IMAGES_DIR, picture_file)
            updates['picture_filepath'] = picture_filepath
        return UserService.update_user(username=username, **updates)


@API.route('/<string:username>', strict_slashes=False)
class OtherUserController(Resource):
    def get(self, username):
        return UserService.get_user(username, auth_info=False)


@API.route('/<string:username>/follow', strict_slashes=False)
class FollowController(Resource):
    @TOKEN_AUTH.login_required
    def post(self, username):
        curr_username = TOKEN_AUTH.current_user()
        return UserService.follow(curr_username, username)


@API.route('/<string:username>/unfollow', strict_slashes=False)
class UnFollowController(Resource):
    @TOKEN_AUTH.login_required
    def post(self, username):
        curr_username = TOKEN_AUTH.current_user()
        return UserService.unfollow(curr_username, username)


@API.route('/<string:username>/is-following', strict_slashes=False)
class UserFollowController(Resource):
    @TOKEN_AUTH.login_required
    def get(self, username):
        curr_username = TOKEN_AUTH.current_user()
        return UserService.is_following(curr_username, username)


@API.route('/<string:username>/posts', strict_slashes=False)
class UserPostsController(Resource):
    def get(self, username):
        skip = request.args.get('skip')
        skip = int(skip) if (skip and skip.isdigit()) else 0
        limit = request.args.get('limit')
        limit = int(limit) if (limit and limit.isdigit()) else 10
        return PostService.get_user_posts(username, skip=skip, limit=limit)
