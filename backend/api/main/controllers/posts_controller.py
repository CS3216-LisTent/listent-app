from flask import request, make_response, jsonify
from flask_restplus import Resource, Namespace
from api.main.services.posts_service import PostService
from api.main.utils.auth_util import TOKEN_AUTH

API = Namespace(name='posts')


@API.route('/', strict_slashes=False)
class PostController(Resource):
    @TOKEN_AUTH.login_required
    def post(self):
        try:
            username = TOKEN_AUTH.current_user()
            title = request.form.get('title')
            description = request.form.get('description')
            audio_file = request.files.get('audio')
            image_file = request.files.get('image')
            return PostService.create_user_post(
                username=username,
                title=title,
                description=description,
                audio_file=audio_file,
                image_file=image_file,
            )
        except Exception as e:
            return make_response(jsonify({'status': 'fail', 'error': str(e)}), 500)

    @TOKEN_AUTH.login_required
    def get(self):
        try:
            username = TOKEN_AUTH.current_user()
            skip = request.args.get('skip')
            skip = int(skip) if (skip and skip.isdigit()) else 0
            limit = request.args.get('limit')
            limit = int(limit) if (limit and limit.isdigit()) else 10
            return PostService.get_user_posts(username, skip=skip, limit=limit)
        except Exception as e:
            return make_response(jsonify({'status': 'fail', 'error': str(e)}), 500)


@API.route('/<string:post_id>', strict_slashes=False)
class PostController(Resource):
    @TOKEN_AUTH.login_required
    def put(self, post_id):
        try:
            username = TOKEN_AUTH.current_user()
            title = request.form.get('title')
            description = request.form.get('description')
            image_file = request.files.get('image')
            return PostService.update_user_post(
                username=username,
                post_id=post_id,
                title=title,
                description=description,
                image_file=image_file,
            )
        except Exception as e:
            return make_response(jsonify({'status': 'fail', 'error': str(e)}), 500)

    @TOKEN_AUTH.login_required
    def delete(self, post_id):
        try:
            username = TOKEN_AUTH.current_user()
            return PostService.delete_user_post(
                username=username,
                post_id=post_id,
            )
        except Exception as e:
            return make_response(jsonify({'status': 'fail', 'error': str(e)}), 500)

    def get(self, post_id):
        try:
            return PostService.get_post(
                post_id=post_id,
            )
        except Exception as e:
            return make_response(jsonify({'status': 'fail', 'error': str(e)}), 500)


@API.route('/feed', strict_slashes=False)
class FeedController(Resource):
    @TOKEN_AUTH.login_required
    def get(self):
        try:
            username = TOKEN_AUTH.current_user()
            skip = request.args.get('skip')
            skip = int(skip) if (skip and skip.isdigit()) else 0
            limit = request.args.get('limit')
            limit = int(limit) if (limit and limit.isdigit()) else 10
            return PostService.get_user_feed_posts(username, skip=skip, limit=limit)
        except Exception as e:
            return make_response(jsonify({'status': 'fail', 'error': str(e)}), 500)


@API.route('/discover', strict_slashes=False)
class PostDiscoveryController(Resource):
    # Hash username to seed value
    @staticmethod
    def hash_to_seed(username):
        try:
            total = 1
            for char in username:
                total = (total * ord(char)) % 1007
            return total
        except Exception as e:
            return make_response(jsonify({'status': 'fail', 'error': str(e)}), 500)

    @TOKEN_AUTH.login_required
    def get(self):
        try:
            username = TOKEN_AUTH.current_user()
            skip = request.args.get('skip')
            skip = int(skip) if (skip and skip.isdigit()) else 0
            limit = request.args.get('limit')
            limit = int(limit) if (limit and limit.isdigit()) else 10
            seed = request.args.get('seed')
            seed = int(seed) if (seed and seed.isdigit()) else PostDiscoveryController.hash_to_seed(username)
            return PostService.get_user_discover_posts(username, skip=skip, limit=limit, seed=seed)
        except Exception as e:
            return make_response(jsonify({'status': 'fail', 'error': str(e)}), 500)


@API.route('/discover/all', strict_slashes=False)
class PostFeedController(Resource):
    def get(self):
        try:
            skip = request.args.get('skip')
            skip = int(skip) if (skip and skip.isdigit()) else 0
            limit = request.args.get('limit')
            limit = int(limit) if (limit and limit.isdigit()) else 10
            seed = request.args.get('seed')
            seed = int(seed) if (seed and seed.isdigit()) else 0
            return PostService.get_discover_posts(skip=skip, limit=limit, seed=seed)
        except Exception as e:
            return make_response(jsonify({'status': 'fail', 'error': str(e)}), 500)


@API.route('/<string:post_id>/comment', strict_slashes=False)
class PostCommentController(Resource):
    @TOKEN_AUTH.login_required
    def post(self, post_id):
        try:
            username = TOKEN_AUTH.current_user()
            text = request.json.get('text')
            return PostService.add_post_comment(post_id, username, text)
        except Exception as e:
            return make_response(jsonify({'status': 'fail', 'error': str(e)}), 500)


@API.route('/<string:post_id>/like', strict_slashes=False)
class LikeCommentController(Resource):
    @TOKEN_AUTH.login_required
    def post(self, post_id):
        try:
            username = TOKEN_AUTH.current_user()
            return PostService.like_post(post_id, username)
        except Exception as e:
            return make_response(jsonify({'status': 'fail', 'error': str(e)}), 500)


@API.route('/<string:post_id>/unlike', strict_slashes=False)
class UnlikeCommentController(Resource):
    @TOKEN_AUTH.login_required
    def post(self, post_id):
        try:
            username = TOKEN_AUTH.current_user()
            return PostService.unlike_post(post_id, username)
        except Exception as e:
            return make_response(jsonify({'status': 'fail', 'error': str(e)}), 500)


@API.route('/search', strict_slashes=False)
class HashtagSearchController(Resource):
    def get(self):
        try:
            search_info = {}
            if ('hashtag' in request.args) and (request.args['hashtag'] is not None):
                search_info['hashtag'] = request.args['hashtag']
            skip = request.args.get('skip')
            search_info['skip'] = int(skip) if (skip and skip.isdigit()) else 0
            limit = request.args.get('limit')
            search_info['limit'] = int(limit) if (limit and limit.isdigit()) else 10
            return PostService.search_hashtag(**search_info)
        except Exception as e:
            return make_response(jsonify({'status': 'fail', 'error': str(e)}), 500)


@API.route('/<string:post_id>/inc-view-count', strict_slashes=False)
class IncreasePostViewController(Resource):
    def post(self, post_id):
        try:
            increase_by = 1
            if ('number' in request.json) and (request.json['number'] is not None) \
                    and (type(request.json['number']) == int):
                increase_by = int(request.json['number'])
            return PostService.increase_view_count(post_id=post_id, number=increase_by)
        except Exception as e:
            return make_response(jsonify({'status': 'fail', 'error': str(e)}), 500)


@API.route('/anonymous', strict_slashes=False)
class PostAnonymousController(Resource):
    def post(self):
        try:
            username = 'anonymous'
            title = request.form.get('title')
            description = request.form.get('description')
            audio_file = request.files.get('audio')
            image_file = request.files.get('image')
            return PostService.create_user_post(
                username=username,
                title=title,
                description=description,
                audio_file=audio_file,
                image_file=image_file,
            )
        except Exception as e:
            return make_response(jsonify({'status': 'fail', 'error': str(e)}), 500)


@API.route('/popular', strict_slashes=False)
class HashtagPopularController(Resource):
    def get(self):
        try:
            skip = request.args.get('skip')
            skip = int(skip) if (skip and skip.isdigit()) else 0
            limit = request.args.get('limit')
            limit = int(limit) if (limit and limit.isdigit()) else 10
            return PostService.get_popular_hashtags(skip=skip, limit=limit)
        except Exception as e:
            return make_response(jsonify({'status': 'fail', 'error': str(e)}), 500)