from flask import Blueprint, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token
from werkzeug.security import check_password_hash
from .models import User, db

auth = Blueprint('auth', __name__)

@auth.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        print("Received data:", data)  # Debug print
        username = data.get('username')
        password = data.get('password')

        if User.query.filter_by(username=username).first():
            return jsonify({'message': 'User already exists'}), 400

        new_user = User(username=username)
        new_user.set_password(password)
        db.session.add(new_user)
        db.session.commit()

        return jsonify({'message': 'User created successfully'}), 201
    except Exception as e:
        print(e)  # Log the error
        return jsonify({'error': 'Internal Server Error'}), 500




@auth.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data.get('username')).first()
    if user and check_password_hash(user.password_hash, data.get('password')):
        user_identity = {'identity': user.id} # This will be used to identify the user in the access token
        access_token = create_access_token(identity=user_identity)
        return jsonify(access_token=access_token), 200
    return jsonify({"msg": "Bad username or password"}), 401