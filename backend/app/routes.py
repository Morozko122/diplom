from app import app
from flask import Flask, jsonify, request
from flask_cors import cross_origin
from flask import jsonify, render_template
from flask import render_template_string
from flask_security import auth_required, permissions_accepted, current_user
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity,get_jwt
from app.decorator import roles_required 
from app.database import db_session
from app.models import Application, Methodologist, User, Role

@app.route("/hello", methods=["GET"])
def hell():
     return {'hi': 'Hello 1223!'}
 
# @app.route("/user")
# @auth_required()
# @permissions_accepted("user-read")
# def user_home():
#     return render_template_string("Hello {{ current_user.email }} you are a user!")


jwt = JWTManager(app)

@app.route('/login_user', methods=['POST'])
def login():    
   print(request.json)
   username = request.json.get('username', None)
   password = request.json.get('password', None)

   user = app.security.datastore.find_user(username=username)
  
   if user and user.password == password:
       access_token = create_access_token(identity=user.username,  additional_claims={"role": user.roles[0].name})
       return jsonify(access_token=access_token), 200
   else:
       return jsonify({"msg": "Invalid username or password"}), 401


@app.route('/admin1', methods=['GET'])
@roles_required(*['admins2', 'adddmin'])
def admin_only():
   current_user = get_jwt_identity()
   print(current_user)
   claims = get_jwt()
  
   return jsonify({'message': f'This is an admin-only endpoint. Hello, {claims["role"]}!'})

# @app.route('/add_spravka', methods=['POST'])
# def add_spravka():
#     data = request.json
#     new_spravka = Spravka(
#         student_code=data['student_code'],
#         spravka_name=data['spravka_name'],
#         spravka_count=data['spravka_count'],
#         status='Pending'  # default status
#     )
#     db_session.add(new_spravka)
#     db_session.commit()
#     return jsonify({"message": "Spravka added successfully"}), 201

@app.route('/get_spravka/<int:student_code>', methods=['GET'])
def get_spravka(student_code):
    spravki = Application.query.filter_by(personal_number=student_code).all()
    if not spravki:
        return jsonify({"message": "No spravki found for this student"}), 404
    
    result = [
        {
            "id": spravka.id,
            "personal_number": spravka.personal_number,
            "name": spravka.name,
            "quantity": spravka.quantity,
            "status": spravka.status,
            "date": spravka.date.strftime('%Y-%m-%d %H:%M:%S')
        } for spravka in spravki
    ]
    return jsonify(result), 200

@app.route('/applications/add', methods=['POST'])
def add_application():
    data = request.json
    personal_number = data.get('personal_number')
    name = data.get('name')
    quantity = data.get('quantity')
    status = "В работе"
    

    new_application = Application(
        personal_number=personal_number,
        name=name,
        quantity=quantity,
        status=status,
        
    )
    db_session.add(new_application)
    db_session.commit()

    return jsonify({"message": "Application added successfully"}), 201

@app.route('/methodologists/<int:methodologist_id>/applications', methods=['GET'])
def get_applications_for_methodologist(methodologist_id):
    methodologist = Methodologist.query.filter_by(id=methodologist_id).all()
    print(methodologist[0].groups)
    applications = []
    for group in methodologist[0].groups:
       
        for student in group.students:
            for application in student.applications:
                applications.append({
                    "id": application.id,
                    "personal_number": application.personal_number,
                    "name": application.name,
                    "quantity": application.quantity,
                    "status": application.status,
                    "date": application.date.strftime('%Y-%m-%d %H:%M:%S')
                })

    return jsonify(applications)

@app.route('/roles', methods=['GET'])
def get_roles():
    roles = Role.query.all()
    roles_list = [
        {
            'id': role.id,
            'name': role.name,
            'description': role.description,
            'permissions': role.permissions
        }
        for role in roles
    ]
    return jsonify(roles_list)

@app.route('/roles', methods=['POST'])
def add_role():
    data = request.json
    new_role = Role(
        name=data['name'],
        description=data.get('description', ''),
        permissions=data.get('permissions', [])
    )
    db_session.add(new_role)
    db_session.commit()
    return jsonify({"message": "Role added", "role": new_role.name})

@app.route('/roles/<int:role_id>', methods=['PUT'])
def edit_role(role_id):
    data = request.json
    role = Role.query.filter_by(id =role_id)
    role.name = data.get('name', role.name)
    role.description = data.get('description', role.description)
    role.permissions = data.get('permissions', role.permissions)
    db_session.commit()
    return jsonify({"message": "Role updated", "role": role.name})

@app.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    users_list = [
        {
            'id': user.id,
            'email': user.email,
            'username': user.username,
            'active': user.active,
            'fs_uniquifier': user.fs_uniquifier,
            'roles': [{'id': role.id, 'name': role.name} for role in user.roles]
        }
        for user in users
    ]
    return jsonify(users_list)
@app.route('/users/<int:user_id>', methods=['GET'])
def get_users_id(user_id):
    users = User.query.filter_by(id = user_id)
    users_list = [
        {
            'id': user.id,
            'email': user.email,
            'username': user.username,
            'active': user.active,
            'fs_uniquifier': user.fs_uniquifier,
            'roles': [{'id': role.id, 'name': role.name} for role in user.roles]
        }
        for user in users
    ]
    return jsonify(users_list)

@app.route('/users', methods=['POST'])
def add_user():
    data = request.json
    new_user = User(
        email=data['email'],
        username=data.get('username', ''),
        password=data['password'],
        active=data.get('active', True),
        fs_uniquifier=data['fs_uniquifier']
    )
    db_session.add(new_user)
    db_session.commit()
    return jsonify({"message": "User added", "user": new_user.email})

@app.route('/users/<int:user_id>', methods=['PUT'])
def edit_user(user_id):
    data = request.json
    user = User.query.filter_by(id = user_id)
    user.email = data.get('email', user.email)
    user.username = data.get('username', user.username)
    user.password = data.get('password', user.password)
    user.active = data.get('active', user.active)
    user.fs_uniquifier = data.get('fs_uniquifier', user.fs_uniquifier)
    db_session.commit()
    return jsonify({"message": "User updated", "user": user.email})
