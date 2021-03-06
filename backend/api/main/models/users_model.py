import re
from datetime import datetime
from pymongo.errors import WriteError
from api.main.config import LOGGER
from api.main.db import DB


class UserModel:

    @staticmethod
    def get_user(username, show_follower_pics=False, show_following_pics=False):
        LOGGER.info(f'DB: Retrieving user with username {username}')
        resp = DB.users.find_one({'_id': username})

        if resp:

            # TODO: Optimise this in the future when no. followers grow
            if show_follower_pics:
                for i, un in enumerate(resp['followers']):
                    picture = UserModel.get_user(un)['picture']
                    resp['followers'][i] = {'username': un, 'picture': picture}

            # TODO: Optimise this in the future when no. followings grow
            if show_following_pics:
                for i, un in enumerate(resp['followings']):
                    picture = UserModel.get_user(un)['picture']
                    resp['followings'][i] = {'username': un, 'picture': picture}
            LOGGER.info(f'Successfully retrieving user: {resp}')

            if 'notifications' not in resp:
                resp['notifications'] = []

            return resp

        raise WriteError(f'Error in querying for {username}. User may not exist.')

    @staticmethod
    def add_user(username, email, description=None, picture=None):
        LOGGER.info(f'DB: Adding user with username {username}, email: {email}, '
                    f'description: {description}, picture: {picture}')
        DB.users.save({
            '_id': username,
            'email': email,
            'picture': picture,
            'description': description,
            'followers': [],
            'followings': [],
            'posts': [],
        })
        LOGGER.info('Successfully added user to DB.')
        return UserModel.get_user(username, show_following_pics=True, show_follower_pics=True)

    @staticmethod
    def update_user(username, **kwargs):
        updated_document = {'_id': username}
        if ('description' in kwargs) and (kwargs['description'] is not None):
            updated_document['description'] = kwargs['description']
        if ('picture' in kwargs) and (kwargs['picture'] is not None):
            updated_document['picture'] = kwargs['picture']
        resp = DB.users.find_one_and_update({'_id': username}, {'$set': updated_document})
        if resp:
            return UserModel.get_user(username, show_following_pics=True, show_follower_pics=True)
        raise WriteError(f'Error in updating {username}. User may not exist.')

    @staticmethod
    def remove_user(username):
        resp = DB.users.find_one_and_delete({'_id': username})
        if resp:
            return resp
        raise WriteError(f'Error in removing {username}. User may not exist.')

    @staticmethod
    def follow(username, other_username):
        user = UserModel.get_user(username)
        other_user = UserModel.get_user(other_username)
        if user and other_user:
            DB.users.find_one_and_update({'_id': username}, {'$addToSet': {'followings': other_username}})
            DB.users.find_one_and_update({'_id': other_username}, {'$addToSet': {'followers': username}})
            updated_user = UserModel.get_user(username, show_follower_pics=True, show_following_pics=True)
            updated_other_user = UserModel.get_user(other_username, show_follower_pics=True, show_following_pics=True)
            return updated_user, updated_other_user
        raise WriteError(
            f'Error in making {username} follow {other_username}. One or both users may not exist.'
        )

    @staticmethod
    def unfollow(username, other_username):
        user = UserModel.get_user(username)
        other_user = UserModel.get_user(other_username)
        if user and other_user:
            DB.users.find_one_and_update({'_id': username}, {'$pull': {'followings': other_username}})
            DB.users.find_one_and_update({'_id': other_username}, {'$pull': {'followers': username}})
            updated_user = UserModel.get_user(username, show_follower_pics=True, show_following_pics=True)
            updated_other_user = UserModel.get_user(other_username, show_follower_pics=True, show_following_pics=True)
            return updated_user, updated_other_user
        raise WriteError(
            f'Error in making {username} unfollow {other_username}. One or both users may not exist.'
        )

    @staticmethod
    def is_following(username, other_username):
        user = UserModel.get_user(username)
        return other_username in user["followings"]

    @staticmethod
    def search_user(query='', skip=0, limit=10):
        users = DB.users.find({'_id': re.compile(query, re.IGNORECASE)}, {'_id': 1}).skip(skip).limit(limit)
        rtn = []
        for user in users:
            username = user['_id']
            rtn.append(UserModel.get_user(username, show_follower_pics=True, show_following_pics=True))
        return rtn

    @staticmethod
    def get_picture(username):
        resp = DB.users.find_one({'_id': username}, {'picture': 1})
        if resp:
            return resp.get('picture')

    @staticmethod
    def add_notification_message(username, message, user_ref=None, post_ref=None):
        timestamp = datetime.utcnow().isoformat()
        notification_payload = {'timestamp': timestamp, 'message': message}
        if user_ref:
            notification_payload['user_ref'] = user_ref
            notification_payload['user_pic'] = UserModel.get_picture(user_ref)
        if post_ref:
            from api.main.models.posts_model import PostModel
            notification_payload['post_ref'] = post_ref
            notification_payload['post_pic'] = PostModel.get_picture(post_ref)
        resp = DB.users.find_one_and_update(
            {'_id': username},
            {'$push': {'notifications': {
                '$each': [notification_payload],
                '$sort': {'timestamp': -1}
            }}}
        )
        if resp:
            return UserModel.get_user(username, show_following_pics=True, show_follower_pics=True)
        raise WriteError(f'Error in updating {username}. User may not exist.')


