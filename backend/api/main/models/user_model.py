from pymongo.errors import WriteError

from api.main.db import DB


class UserModel:
    @staticmethod
    def add_user(username):
        DB.users.save({
            '_id': username,
            'followers': [],
            'followings': [],
            'posts': []
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
        updated_document = {'_id': username, 'email': email}
        resp = DB.users.find_one_and_modify({'_id': username}, updated_document)
        if resp:
            return updated_document
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
            DB.users.update(following_user, {'$push': {'followings': followed_username}})
            DB.users.update(followed_user, {'$push': {'followers': following_username}})
            updated_following = UserModel.get_user(following_username)
            updated_followed = UserModel.get_user(followed_username)
            return updated_following, updated_followed
        raise WriteError(
            f'Error in the operation of making {following_username} follow {followed_username}. '
            'One or both users may not exist.')
