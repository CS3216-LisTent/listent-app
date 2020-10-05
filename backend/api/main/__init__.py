
from api.main.config import config_by_name
from flask import Blueprint
from flask_restplus import Api
from api.main.controllers.user_controller import API as AUTH_NS

NAMESPACES = [
    AUTH_NS,
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

