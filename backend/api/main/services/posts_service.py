import uuid
from botocore.exceptions import ClientError
from flask import make_response, jsonify
from pymongo.errors import OperationFailure, ConnectionFailure
from api.main.models.posts_model import PostModel
from api.main.utils.file_util import upload_file


class PostService:

    @staticmethod
    def get_post(post_id):
        try:
            post_data = PostModel.get_post(post_id)
            return make_response(
                jsonify({
                    'status': 'success',
                    'message': 'Posts successfully queried.',
                    'data': post_data
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
    def create_user_post(username, title, audio_filepath, description=None, image_filepath=None):
        try:
            post_id = uuid.uuid4().hex
            audio_link = upload_file(audio_filepath, uuid.uuid4().hex + '.mp3')
            image_link = upload_file(image_filepath, uuid.uuid4().hex + '.png') if image_filepath else None
            post_data = PostModel.add_user_post(
                username=username,
                post_id=post_id,
                title=title,
                audio_link=audio_link,
                description=description,
                image_link=image_link
            )
            return make_response(
                jsonify({
                    'status': 'success',
                    'message': 'Post successfully created.',
                    'data': post_data
                }), 201
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
    def update_user_post(username, post_id, title=None, description=None, image_filepath=None):
        try:
            updates = {}
            if title is not None:
                updates['title'] = title
            if description is not None:
                updates['description'] = description
            if image_filepath is not None:
                image_link = upload_file(image_filepath, uuid.uuid4().hex + '.png')
                updates['image_link'] = image_link
            post_data = PostModel.update_user_post(username, post_id, **updates)
            return make_response(
                jsonify({
                    'status': 'success',
                    'message': 'Post successfully updated.',
                    'data': post_data
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
    def delete_user_post(username, post_id):
        try:
            post_data = PostModel.remove_user_post(username, post_id)
            return make_response(
                jsonify({
                    'status': 'success',
                    'message': 'Post successfully deleted.',
                    'data': post_data
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
    def get_user_posts(username, skip=0, limit=10):
        try:
            posts_data = PostModel.get_user_posts(username, skip=skip, limit=limit)
            return make_response(
                jsonify({
                    'status': 'success',
                    'message': 'Posts successfully queried.',
                    'data': posts_data
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
    def get_user_feed_posts(username, skip=0, limit=10):
        try:
            posts_data = PostModel.get_user_feed_posts(username, skip=skip, limit=limit)
            return make_response(
                jsonify({
                    'status': 'success',
                    'message': 'Posts successfully queried.',
                    'data': posts_data
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
    def get_discover_posts(skip=0, limit=10):
        try:
            posts_data = PostModel.get_discover_posts(skip=skip, limit=limit)
            return make_response(
                jsonify({
                    'status': 'success',
                    'message': 'Posts successfully queried.',
                    'data': posts_data
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
    def get_user_discover_posts(username, skip=0, limit=10):
        try:
            posts_data = PostModel.get_user_discover_posts(username, skip=skip, limit=limit)
            return make_response(
                jsonify({
                    'status': 'success',
                    'message': 'Posts successfully queried.',
                    'data': posts_data
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
    def add_post_comment(post_id, username, text):
        try:
            post_data = PostModel.add_comment(
                post_id=post_id,
                username=username,
                text=text
            )
            return make_response(
                jsonify({
                    'status': 'success',
                    'message': 'Comment successfully added to post.',
                    'data': post_data
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
    def like_post(post_id, username):
        try:
            post_data = PostModel.like_post(
                post_id=post_id,
                username=username,
            )
            return make_response(
                jsonify({
                    'status': 'success',
                    'message': 'Post successfully liked.',
                    'data': post_data
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
    def unlike_post(post_id, username):
        try:
            post_data = PostModel.unlike_post(
                post_id=post_id,
                username=username,
            )
            return make_response(
                jsonify({
                    'status': 'success',
                    'message': 'Post successfully unliked.',
                    'data': post_data
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