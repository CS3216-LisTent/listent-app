from flask import Flask
from flask_cors import CORS
from werkzeug.middleware.proxy_fix import ProxyFix
from api.main import config_by_name, create_blueprint
from api.main.config import ENV


def create_app(env):
    app = Flask(__name__)
    CORS(app)
    app.app_context().push()
    app.config.from_object(config_by_name[env])
    app.register_blueprint(create_blueprint())
    app.wsgi_app = ProxyFix(app.wsgi_app)
    return app


APP = create_app(ENV)
