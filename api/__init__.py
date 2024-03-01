from flask import Flask
from flask_migrate import Migrate
from .models import db
from flask_cors import CORS
from flask_jwt_extended import JWTManager

jwt = JWTManager()

def create_app(debug=True):
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
    app.config['JWT_SECRET_KEY'] = 'super-secret' 

    db.init_app(app)
    jwt.init_app(app)
    CORS(app)
    migrate = Migrate(app, db)

    from .auth import auth as auth_blueprint
    app.register_blueprint(auth_blueprint)

    from .tasks import tasks as tasks_blueprint
    app.register_blueprint(tasks_blueprint)

    return app

app = create_app()
if __name__ == '__main__':
    app.run(debug=True)