import pymongo
from pymongo.errors import WriteError
from api.main.db import DB
from api.main.models.users_model import UserModel


class PostModel:

    @staticmethod
    def get_post(post_id):
        resp = DB.posts.find_one({'_id': post_id})
        if resp:
            return resp
        raise WriteError('Error in getting post. Post may not exist.')

    # Get random discovery contents as logged out users
    # TODO: Change this to be adaptive with the number of likes or the current trends.
    @staticmethod
    def get_discover_posts(skip=0, limit=10):
        return [post for post in DB.posts.find().sort('timestamp', pymongo.DESCENDING).skip(skip).limit(limit)]

    @staticmethod
    def add_user_post(username, post_id, title, audio_link, timestamp, description=None, image_link=None):
        user = UserModel.get_user(username)
        if user:
            DB.posts.insert({
                '_id': post_id,
                'username': username,
                'title': title,
                'description': description,
                'audio_link': audio_link,
                'image_link': image_link,
                'timestamp': timestamp,
                'comments': [],
                'liked_by': []
            })
            DB.users.find_one_and_update({'_id': username}, {'$addToSet': {'posts': post_id}})
            return PostModel.get_post(post_id)
        raise WriteError('Error in creating post. User may not exist.')

    @staticmethod
    def update_user_post(username, post_id, **updates):
        user = UserModel.get_user(username)
        post = PostModel.get_post(post_id)
        if post['_id'] in user['posts']:
            updated_document = {'_id': post_id}
            if 'title' in updates:
                updated_document['title'] = updates['title']
            if 'description' in updates:
                updated_document['description'] = updates['description']
            if 'audio_link' in updates:
                updated_document['audio_link'] = updates['audio_link']
            if 'image_link' in updates:
                updated_document['image_link'] = updates['image_link']
            DB.posts.find_one_and_update({'_id': post_id}, {'$set': updated_document})
            return PostModel.get_post(post_id)
        raise WriteError(f'Error in removing post. User may not be authorized to remove this post.')

    @staticmethod
    def remove_user_post(username, post_id):
        user = UserModel.get_user(username)
        post = PostModel.get_post(post_id)
        if post['_id'] in user['posts']:
            post_resp = DB.posts.find_one_and_delete({'_id': post_id})
            user_resp = DB.users.find_one_and_update({'_id': username}, {'$pull': {'posts': post_id}})
            return user_resp, post_resp
        raise WriteError(f'Error in removing post. User may not be authorized to remove this post.')

    @staticmethod
    def get_user_posts(username, skip=0, limit=10):
        user = UserModel.get_user(username)
        if user:
            posts = [PostModel.get_post(post_id) for post_id in user['posts'][skip:skip + limit]]
            posts.sort(key=lambda post: post['timestamp'], reverse=True)
            return posts
        raise WriteError(f'Error in querying posts. User may not exist.')

    @staticmethod
    def get_user_feed_posts(username, skip=0, limit=10):
        user = UserModel.get_user(username)
        if user:
            followings = [username for username in user['followings']]
            posts = []
            for username in followings:
                posts.extend(PostModel.get_user_posts(username))
            posts.sort(key=lambda post: post['timestamp'], reverse=True)
            return posts[skip:skip+limit]
        raise WriteError(f'Error in querying posts. User may not exist.')

    # Get random discovery contents as logged in users
    # TODO: Change this to be adaptive with the number of likes or the current trends.
    @staticmethod
    def get_user_discover_posts(username, skip=0, limit=10):
        user = UserModel.get_user(username)
        if user:
            return [post for post in DB.posts.find({'username': {'$ne': username}}).sort('timestamp', pymongo.DESCENDING).skip(skip).limit(limit)]
        raise WriteError(f'Error in querying posts. User may not exist.')

    @staticmethod
    def like_post(post_id, username):
        user = UserModel.get_user(username)
        post = PostModel.get_post(post_id)
        if user and post:
            DB.posts.find_one_and_update({'_id': post_id}, {'$addToSet': {'liked_by': username}})
            return PostModel.get_post(post_id)
        raise WriteError(f'Error in liking post. User or post may not exist.')

    @staticmethod
    def unlike_post(post_id, username):
        post = PostModel.get_post(post_id)
        user = UserModel.get_user(username)
        if user and post:
            DB.posts.find_one_and_update({'_id': post_id}, {'$pull': {'liked_by': username}})
            return PostModel.get_post(post_id)
        raise WriteError(f'Error in unliking post. User or post may not exist.')

    @staticmethod
    def add_comment(post_id, username, text, timestamp):
        post = PostModel.get_post(post_id)
        user = UserModel.get_user(username)
        if user and post:
            comment = {'username': username, 'text': text, 'timestamp': timestamp}
            DB.posts.find_one_and_update({'_id': post_id}, {'$push': {'comments': comment}})
            return PostModel.get_post(post_id)
        raise WriteError(f'Error in adding comment. User or post may not exist.')
