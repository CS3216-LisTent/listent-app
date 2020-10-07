from pymongo.errors import WriteError

from api.main.db import DB


class UserModel:
    @staticmethod
    def add_user(username):
        DB.users.save({
            '_id': username,
            'followers': [],
            'followings': [],
            'posts': [],
            'description': '',
            'profile_picture': '',
        })
        return UserModel.get_user(username)

    @staticmethod
    def remove_user(username):
        resp = DB.users.find_one_and_delete({'_id': username})
        if resp:
            return resp
        raise WriteError(
            f'Error in removing user with username: {username}. '
            'User may not exist.')

    @staticmethod
    def update_user(username, email):
        updated_document = {'email': email}
        resp = DB.users.find_one_and_update({'_id': username}, {'$set': updated_document})
        if resp:
            return UserModel.get_user(username)
        raise WriteError(
            f'Error in updating user with username: {username}. '
            'User may not exist.')

    @staticmethod
    def get_user(username):
        resp = DB.users.find_one({'_id': username})
        if resp:
            return resp
        raise WriteError(
            f'Error in getting user with username: {username}. '
            'User may not exist.')

    @staticmethod
    def follow(following_username, followed_username):
        following_user = UserModel.get_user(following_username)
        followed_user = UserModel.get_user(followed_username)
        if followed_user and following_user:
            DB.users.find_one_and_update(following_user, {'$addToSet': {'followings': followed_username}})
            DB.users.find_one_and_update(followed_user, {'$addToSet': {'followers': following_username}})
            updated_following = UserModel.get_user(following_username)
            updated_followed = UserModel.get_user(followed_username)
            return updated_following, updated_followed
        raise WriteError(
            f'Error in the operation of making {following_username} follow {followed_username}. '
            'One or both users may not exist.')

    @staticmethod
    def is_following(username, other_username):
        user = UserModel.get_user(username)
        return other_username in user["followings"]
