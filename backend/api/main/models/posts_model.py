import re
import pymongo
from pymongo.errors import WriteError
from api.main.db import DB
from api.main.models.users_model import UserModel
import numpy.random as rng

from api.main.utils.score_util import get_post_score


class PostModel:
    @staticmethod
    def get_post(post_id):
        resp = list(DB.posts.aggregate([
            {'$match': {'_id': post_id}},
            {'$unwind': '$comments'},
            {'$sort': {'comments.timestamp': -1}},
            {'$group': {
                '_id': '$_id',
                'username': {'$first': '$username'},
                'title': {'$first': '$title'},
                'description': {'$first': '$description'},
                'audio_link': {'$first': '$audio_link'},
                'view_count': {'$first': '$view_count'},
                'timestamp': {'$first': '$timestamp'},
                'liked_by': {'$first': '$liked_by'},
                'comments': {'$push': '$comments'}}},
        ]))
        if resp and resp[0]:
            post_info = resp[0]
            return post_info
        raise WriteError('Error in getting post. Post may not exist.')

    # Return the k-th element based on the default ordering
    @staticmethod
    def get_post_based_on_order(k):
        return DB.posts.find().skip(int(k)).limit(1)[0]

    # Get random discovery contents as logged out users
    # TODO: Change this to be adaptive with the number of likes or the current trends.
    @staticmethod
    def get_discover_posts(skip=0, limit=10, seed=0):
        # total_post = DB.posts.find().count()
        # random_permute = rng.RandomState(seed).permutation(total_post)
        # selected_posts = random_permute[skip:skip + limit]
        # discovered_posts = []
        # for post_order in selected_posts:
        #     discovered_posts.append(PostModel.get_post_based_on_order(post_order))
        all_posts = list(DB.posts.find())
        all_posts.sort(key=lambda post: get_post_score(post), reverse=True)
        return all_posts[skip:skip+limit]

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
                'liked_by': [],
                'view_count': 0
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
            posts = [PostModel.get_post(post_id) for post_id in user['posts']]
            posts.sort(key=lambda post: post['timestamp'], reverse=True)
            return posts[skip:skip + limit]
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
            return posts[skip:skip + limit]
        raise WriteError(f'Error in querying posts. User may not exist.')

    # Get random discovery contents as logged in users
    # TODO: Change this to be adaptive with the number of likes or the current trends.
    @staticmethod
    def get_user_discover_posts(username, skip=0, limit=10, seed=0):
        user = UserModel.get_user(username)
        if user:
            all_posts = list(DB.posts.find({'username': {'$ne': username}}))
            all_posts.sort(key=lambda post: get_post_score(post), reverse=True)
            # random_permute = rng.RandomState(seed).permutation(total_post)
            # selected_posts = random_permute[skip:skip + limit]
            # discovered_posts = []
            # for post_order in selected_posts:
            #     discovered_posts += DB.posts.find({'username': {'$ne': username}}).skip(int(post_order)).limit(1)
            return all_posts[skip:skip+limit]
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

    @staticmethod
    def search_hashtag(tag, skip=0, limit=5):
        if len(tag) == 0:
            return []
        if tag[0] != '#':
            tag = '#' + tag
        posts = list(DB.posts.find({
            "$or": [
                {"title": re.compile(tag, re.IGNORECASE)},
                {"description": re.compile(tag, re.IGNORECASE)},
            ]
        }, {'comments': 0}).sort("timestamp", pymongo.DESCENDING).skip(skip).limit(limit))
        return posts

    @staticmethod
    def inc_view_count_by_n(post_id, n=1):
        post = PostModel.get_post(post_id)
        if post:
            resp = DB.posts.find_one_and_update({'_id': post_id}, {'$inc': {'view_count': n}})
            if resp:
                return PostModel.get_post(post_id)
        raise WriteError('Error in incrementing the view count. Post may not exist.')
