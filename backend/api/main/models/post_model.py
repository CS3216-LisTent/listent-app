from pymongo.errors import WriteError
from api.main.db import DB


class PostModel:
    @staticmethod
    def add_post(username, post_id, title, description, audio_link, image_link):
        DB.posts.save({
            '_id': post_id,
            'title': title,
            'description': description,
            'audio_link': audio_link,
            'image_link': image_link,
            'comments': []
        })
        DB.users.update({'_id': username}, {'$addToSet': {'posts': post_id}})
        return PostModel.get_post(post_id)

    @staticmethod
    def remove_post(post_id, username):
        resp_post = DB.posts.find_one_and_delete({'_id': post_id})
        resp_user = DB.users.find_one_and_update({'_id': username}, {'$pull': {'posts': post_id}})
        if resp_post and resp_user:
            return resp_post
        raise WriteError(
            f'Error in removing post with post_id: {post_id}. '
            'Post may not exist.')

    @staticmethod
    def update_post(post_id, **kwargs):
        resp = DB.users.find_one_and_modify({'_id': post_id}, **kwargs)
        if resp:
            return PostModel.get_post(post_id)
        raise WriteError(
            f'Error in updating user with post: {post_id}. '
            'User may not exist.')

    @staticmethod
    def get_post(post_id):
        resp = DB.users.find_one({'_id': post_id})
        if resp:
            return resp
        raise WriteError(
            f'Error in getting post with post_id: {post_id}. '
            'Post may not exist.')

    @staticmethod
    def get_all_post():
        resp = DB.posts.find()
        if resp:
            all_posts = [post for post in resp]
            return all_posts
        raise WriteError(
            f'Error in getting all posts.'
        )
