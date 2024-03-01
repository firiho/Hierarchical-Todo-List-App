from flask import request, jsonify, Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from .models import User, ListItem, db, List

tasks = Blueprint('tasks', __name__)

@tasks.route('/')
def hello_world():
    return 'Hello, You shouldn\'t be here!'

@tasks.route('/new-list', methods=['POST'])
def create_tasks():
    data = request.json
    try:
        for item in data:
            # Create new ListItem for each item in the received data
            new_item = ListItem(title=item['title'], list_id = item.get('list_id'), parent_id=item.get('parent_id'), user_id=item['user_id'])
            db.session.add(new_item)
        db.session.commit()
        return jsonify({'message': 'Tasks successfully created'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
    
@tasks.route('/lists', methods=['GET'])
@jwt_required()
def display_lists():
    user_id = get_jwt_identity()  # Retrieve user ID from the JWT token
    user = User.query.get(user_id['identity'])
    if user:
        # Filter only main tasks (those with no parent)
        main_tasks = ListItem.query.filter_by(user_id=user_id['identity'], parent_id=None).all()
        return jsonify([item.serialize_hierarchy() for item in main_tasks]), 200
    return jsonify({'error': 'User not found'}), 404

@tasks.route('/next-id', methods=['GET'])
def get_next_id():
    try:
        # Find the maximum id value
        max_id = db.session.query(db.func.max(ListItem.id)).scalar()
        # If there are no items, start with 1. Otherwise, add 1 to the max id.
        next_id = 1 if max_id is None else max_id + 1
        return jsonify({'next_id': next_id}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    
@tasks.route('/edit-task', methods=['PUT'])
@jwt_required()  # Ensure this route is protected
def edit_task():
    user_id = get_jwt_identity()['identity']
    task_data = request.json
    task_id = task_data.get('id')
    new_title = task_data.get('title')
    
    if not task_id or new_title is None:
        return jsonify({'error': 'Missing task ID or new title'}), 400

    task = ListItem.query.filter_by(id=task_id, user_id=user_id).first()
    if task:
        task.title = new_title
        db.session.commit()
        return jsonify({'message': 'Task updated successfully'}), 200
    else:
        return jsonify({'error': 'Task not found or not authorized to edit this task'}), 404

def delete_sub_items(task_id):
    # Find sub-items of the current task
    sub_items = ListItem.query.filter_by(parent_id=task_id).all()
    for sub_item in sub_items:
        # Recursively delete each sub-item
        delete_sub_items(sub_item.id)
        db.session.delete(sub_item)

@tasks.route('/delete-task/<int:task_id>', methods=['DELETE'])
@jwt_required()  # Ensure this route is protected
def delete_task(task_id):
    user_id = get_jwt_identity()['identity']  # Assuming your JWT stores user identity this way
    task = ListItem.query.filter_by(id=task_id, user_id=user_id).first()  # Ensure task belongs to user
    if task:
        # Delete the task and all its sub-items
        delete_sub_items(task_id)
        db.session.delete(task)
        db.session.commit()
        return jsonify({'message': 'Task and all sub-tasks deleted successfully'}), 200
    else:
        return jsonify({'error': 'Task not found or not authorized to delete this task'}), 404
    
# get lists
@tasks.route('/get-lists', methods=['GET'])
@jwt_required()
def get_lists():
    user_id = get_jwt_identity()
    lists = List.query.filter_by(user_id=user_id['identity']).all()
    return jsonify([list.serialize() for list in lists]), 200

# create list
@tasks.route('/create-list', methods=['POST'])
@jwt_required()
def create_list():
    data = request.get_json()
    list_name = data.get('name')
    user_id = get_jwt_identity()['identity']
    new_list = List(name=list_name, user_id=user_id)
    db.session.add(new_list)
    db.session.commit()
    
    return jsonify({'message': f'List {list_name} created successfully'}), 201

# delete list
@tasks.route('/delete-list/<int:list_id>', methods=['DELETE'])
@jwt_required()
def delete_list(list_id):
    user_id = get_jwt_identity()['identity']
    list = List.query.filter_by(id=list_id, user_id=user_id).first()
    if list:
        db.session.delete(list)
        db.session.commit()
        return jsonify({'message': 'List deleted successfully'}), 200
    else:
        return jsonify({'error': 'List not found or not authorized to delete this list'}), 404

@tasks.route('/move-task/<int:task_id>/<int:new_list_id>', methods=['PUT'])
@jwt_required()
def change_task_list(task_id, new_list_id):
    user_id = get_jwt_identity()['identity']
    # Verify the new list belongs to the user
    new_list = List.query.filter_by(id=new_list_id, user_id=user_id).first()
    if not new_list:
        return jsonify({'error': 'New list not found or not authorized to add tasks to this list'}), 404

    task = ListItem.query.filter_by(id=task_id, user_id=user_id).first()

    # Update the list_id for the task and its children
    subtasks = ListItem.query.filter_by(parent_id=task_id).all()
    subsubtasks = []
    for t in subtasks:
        subsubtasks += ListItem.query.filter_by(parent_id=t.id).all()
    tasks_to_update = [task] + subtasks + subsubtasks
    for task_to_update in tasks_to_update:
        task_to_update.list_id = new_list_id

    db.session.commit()
    return jsonify({'message': 'Task and its children moved successfully'}), 200
