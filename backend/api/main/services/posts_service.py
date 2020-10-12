import uuid
from datetime import datetime
from botocore.exceptions import ClientError
from flask import make_response, jsonify
from pymongo.errors import OperationFailure, ConnectionFailure
from api.main.models.users_model import UserModel
from api.main.models.posts_model import PostModel
from api.main.utils.file_util import upload
from api.main.utils.image_util import process_image
from pydub import AudioSegment
from pydub.exceptions import CouldntDecodeError, CouldntEncodeError
import os
import io
from PIL import UnidentifiedImageError


class PostService:

    @staticmethod
    def get_post(post_id):
        try:
            post_data = PostModel.get_post(post_id)
            profile_picture = UserModel.get_user(post_data["username"])['picture']
            post_data["profile_picture"] = profile_picture
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
    def create_user_post(username, title, audio_file, description=None, image_file=None):
        try:
            post_id = uuid.uuid4().hex
            timestamp = datetime.utcnow().isoformat()
            file_name, file_ext = os.path.splitext(audio_file.filename)
            # todo: multithread or multiprocess the audio conversion cos it's blocking and uses high cpu
            audio = AudioSegment.from_file(audio_file, format=file_ext.lstrip('.'))
            if len(audio) > 12*60*60*1000: # len(audio) is audio duration in ms
                return make_response(
                    jsonify({
                        'status': 'fail',
                        'message': f'Audio duration is longer than 12 minutes, actual duration = {len(audio)/1000/60}min.'
                    }), 400
                )
            # export in memory, not stored to disk
            audio_buffer = io.BytesIO()
            audio.export(audio_buffer, format='webm')
            audio_link = upload(audio_buffer, uuid.uuid4().hex + '.webm')
            audio_buffer.close()

            image_link = None
            if image_file is not None:
                file_name, file_ext = os.path.splitext(image_file.filename)
                image_buffer = io.BytesIO()
                process_image(image_file, image_buffer)
                image_link = upload(image_buffer, uuid.uuid4().hex + file_ext)
                image_buffer.close()

            post_data = PostModel.add_user_post(
                username=username,
                post_id=post_id,
                title=title,
                timestamp=timestamp,
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
        except CouldntDecodeError as e:
            return make_response(
                jsonify({
                    'status': 'fail',
                    'message': f'PyDub failed to decode: {str(e)}',
                }), 400
            )
        except CouldntEncodeError as e:
            return make_response(
                jsonify({
                    'status': 'fail',
                    'message': f'PyDub failed to encode: {str(e)}',
                }), 500
            )
        except UnidentifiedImageError as e:
            return make_response(
                jsonify({
                    'status': 'fail',
                    'message': f'PIL failed to read image: {str(e)}',
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
    def update_user_post(username, post_id, title=None, description=None, image_file=None):
        try:
            updates = {}
            if title is not None:
                updates['title'] = title
            if description is not None:
                updates['description'] = description
            if image_file is not None:
                file_name, file_ext = os.path.splitext(image_file.filename)
                image_buffer = io.BytesIO()
                process_image(image_file, image_buffer)
                image_link = upload(image_buffer, uuid.uuid4().hex + file_ext)
                image_buffer.close()
                updates['image_link'] = image_link
            post_data = PostModel.update_user_post(username, post_id, **updates)
            return make_response(
                jsonify({
                    'status': 'success',
                    'message': 'Post successfully updated.',
                    'data': post_data
                }), 200
            )
        except UnidentifiedImageError as e:
            return make_response(
                jsonify({
                    'status': 'fail',
                    'message': f'PIL failed to read image: {str(e)}',
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
    def get_discover_posts(skip=0, limit=10, seed=0):
        try:
            posts_data = PostModel.get_discover_posts(skip=skip, limit=limit, seed=seed)
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
    def get_user_discover_posts(username, skip=0, limit=10, seed=0):
        try:
            posts_data = PostModel.get_user_discover_posts(username, skip=skip, limit=limit, seed=seed)
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
            timestamp = datetime.utcnow().isoformat()
            post_data = PostModel.add_comment(
                post_id=post_id,
                username=username,
                text=text,
                timestamp=timestamp
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