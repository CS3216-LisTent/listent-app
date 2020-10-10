from pymongo.errors import WriteError
from api.main.db import DB


class UserModel:

    @staticmethod
    def get_user(username):
        resp = DB.users.find_one({'_id': username})
        if resp:
            return resp
        raise WriteError(f'Error in querying for {username}. User may not exist.')

    @staticmethod
    def add_user(username, description=None):
        DB.users.save({
            '_id': username,
            'description': description,
            'followers': [],
            'followings': [],
            'posts': [],
        })
        return UserModel.get_user(username)

    @staticmethod
    def update_user(username, **kwargs):
        updated_document = {'_id': username}
        if 'description' in kwargs:
            updated_document['description'] = kwargs['description']
        resp = DB.users.find_one_and_update({'_id': username}, {'$set': updated_document})
        if resp:
            return UserModel.get_user(username)
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
            DB.users.find_one_and_update(user, {'$addToSet': {'followings': other_username}})
            DB.users.find_one_and_update(other_user, {'$addToSet': {'followers': username}})
            updated_user = UserModel.get_user(username)
            updated_other_user = UserModel.get_user(other_username)
            return updated_user, updated_other_user
        raise WriteError(
            f'Error in making {username} follow {other_username}. One or both users may not exist.'
        )

    @staticmethod
    def unfollow(username, other_username):
        user = UserModel.get_user(username)
        other_user = UserModel.get_user(other_username)
        if user and other_user:
            DB.users.find_one_and_update(user, {'$pull': {'followings': other_username}})
            DB.users.find_one_and_update(other_user, {'$pull': {'followers': username}})
            updated_user = UserModel.get_user(username)
            updated_other_user = UserModel.get_user(other_username)
            return updated_user, updated_other_user
        raise WriteError(
            f'Error in making {username} unfollow {other_username}. One or both users may not exist.'
        )

    @staticmethod
    def is_following(username, other_username):
        user = UserModel.get_user(username)
        return other_username in user["followings"]
