from flask import request
from flask_restplus import Resource, Namespace
from api.main.services.posts_service import PostService
from api.main.utils.auth_util import TOKEN_AUTH
from api.main.utils.file_util import save_file
from api.main.config import IMAGES_DIR, AUDIO_DIR

API = Namespace(name='posts')


@API.route('/', strict_slashes=False)
class PostController(Resource):
    @TOKEN_AUTH.login_required
    def post(self):
        username = TOKEN_AUTH.current_user()
        title = request.form.get('title')
        description = request.form.get('description')
        audio_file = request.files.get('audio')
        image_file = request.files.get('image')
        image_filepath = save_file(IMAGES_DIR, image_file) if image_file else None
        return PostService.create_user_post(
            username=username,
            title=title,
            description=description,
            audio_file=audio_file,
            image_filepath=image_filepath,
        )

    @TOKEN_AUTH.login_required
    def get(self):
        username = TOKEN_AUTH.current_user()
        skip = request.args.get('skip')
        skip = int(skip) if (skip and skip.isdigit()) else 0
        limit = request.args.get('limit')
        limit = int(limit) if (limit and limit.isdigit()) else 10
        return PostService.get_user_posts(username, skip=skip, limit=limit)


@API.route('/<string:post_id>', strict_slashes=False)
class PostController(Resource):
    @TOKEN_AUTH.login_required
    def put(self, post_id):
        username = TOKEN_AUTH.current_user()
        title = request.form.get('title')
        description = request.form.get('description')
        image_file = request.files.get('image')
        image_filepath = save_file(IMAGES_DIR, image_file) if image_file else None
        return PostService.update_user_post(
            username=username,
            post_id=post_id,
            title=title,
            description=description,
            image_filepath=image_filepath,
        )

    @TOKEN_AUTH.login_required
    def delete(self, post_id):
        username = TOKEN_AUTH.current_user()
        return PostService.delete_user_post(
            username=username,
            post_id=post_id,
        )

    def get(self, post_id):
        return PostService.get_post(
            post_id=post_id,
        )


@API.route('/feed', strict_slashes=False)
class DiscoveryController(Resource):
    @TOKEN_AUTH.login_required
    def get(self):
        username = TOKEN_AUTH.current_user()
        skip = request.args.get('skip')
        skip = int(skip) if (skip and skip.isdigit()) else 0
        limit = request.args.get('limit')
        limit = int(limit) if (limit and limit.isdigit()) else 10
        return PostService.get_user_feed_posts(username, skip=skip, limit=limit)


@API.route('/discover', strict_slashes=False)
class PostDiscoveryController(Resource):
    # Hash username to seed value
    @staticmethod
    def hash_to_seed(username):
        total = 1
        for char in username:
            total = (total * ord(char)) % 1007
        return total

    @TOKEN_AUTH.login_required
    def get(self):
        username = TOKEN_AUTH.current_user()
        skip = request.args.get('skip')
        skip = int(skip) if (skip and skip.isdigit()) else 0
        limit = request.args.get('limit')
        limit = int(limit) if (limit and limit.isdigit()) else 10
        seed = request.args.get('seed')
        seed = int(seed) if (seed and seed.isdigit()) else PostDiscoveryController.hash_to_seed(username)
        return PostService.get_user_discover_posts(username, skip=skip, limit=limit, seed=seed)


@API.route('/discover/all', strict_slashes=False)
class PostFeedController(Resource):
    def get(self):
        skip = request.args.get('skip')
        skip = int(skip) if (skip and skip.isdigit()) else 0
        limit = request.args.get('limit')
        limit = int(limit) if (limit and limit.isdigit()) else 10
        seed = request.args.get('seed')
        seed = int(seed) if (seed and seed.isdigit()) else 0
        return PostService.get_discover_posts(skip=skip, limit=limit, seed=seed)

@API.route('/<string:post_id>/comment', strict_slashes=False)
class PostCommentController(Resource):
    @TOKEN_AUTH.login_required
    def post(self, post_id):
        username = TOKEN_AUTH.current_user()
        text = request.json.get('text')
        return PostService.add_post_comment(post_id, username, text)


@API.route('/<string:post_id>/like', strict_slashes=False)
class LikeCommentController(Resource):
    @TOKEN_AUTH.login_required
    def post(self, post_id):
        username = TOKEN_AUTH.current_user()
        return PostService.like_post(post_id, username)


@API.route('/<string:post_id>/unlike', strict_slashes=False)
class UnlikeCommentController(Resource):
    @TOKEN_AUTH.login_required
    def post(self, post_id):
        username = TOKEN_AUTH.current_user()
        return PostService.unlike_post(post_id, username)