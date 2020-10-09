
from api.main.config import config_by_name
from flask import Blueprint
from flask_restplus import Api
from api.main.controllers.auth_controller import API as AUTH_NS
from api.main.controllers.posts_controller import API as POSTS_NS
from api.main.controllers.users_controller import API as USERS_NS

NAMESPACES = [
    AUTH_NS,
    POSTS_NS,
    USERS_NS
]


def create_blueprint():
    bp = Blueprint(
        'main',
        __name__,
        url_prefix='/api/v1'
    )
    api = Api(
        app=bp, version="1.0",
        title="LisTent API",
        description="Public API for LisTent application"
    )
    for ns in NAMESPACES:
        api.add_namespace(ns)
    return bp

