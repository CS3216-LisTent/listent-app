import os
from flask import Flask
from flask_cors import CORS
from werkzeug.middleware.proxy_fix import ProxyFix
from api.main import config_by_name, create_blueprint
from api.main.config import ENV, IMAGES_DIR, AUDIO_DIR


def set_directory(path):
    if not os.path.exists(path):
        os.mkdir(path)


def create_app(env):
    set_directory(IMAGES_DIR)
    set_directory(AUDIO_DIR)
    app = Flask(__name__)
    CORS(app)
    app.app_context().push()
    app.config.from_object(config_by_name[env])
    app.register_blueprint(create_blueprint())
    app.wsgi_app = ProxyFix(app.wsgi_app)
    return app

APP = create_app(ENV)
