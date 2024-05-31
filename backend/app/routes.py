from app import app
from flask import Flask, jsonify, request
from flask_cors import cross_origin
from flask import jsonify, render_template
from flask import render_template_string
from flask_security import auth_required, permissions_accepted, current_user, hash_password, verify_password
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity,get_jwt, unset_jwt_cookies
from app.decorator import roles_required 
from app.database import db_session
from app.models import Application, Methodologist, User, Role, Student, Group

jwt = JWTManager(app)

@app.route('/login_user', methods=['POST'])
def login():    
   print(request.json)
   username = request.json.get('username', None)
   password = request.json.get('password', None)

   user = app.security.datastore.find_user(email=username)
  
   if user and verify_password(password, user.password):
       access_token = create_access_token(identity=user.username,  additional_claims={"role": user.roles[0].name})
       return jsonify(access_token=access_token, user_role=user.roles[0].name), 200
   else:
       return jsonify({"msg": "Invalid username or password"}), 401

@app.route("/logout", methods=["POST"])
def logout():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response


@app.route('/admin1', methods=['GET'])
@roles_required(*['admin', 'adddmin'])
def admin_only():
   current_user = get_jwt_identity()
   print(current_user)
   claims = get_jwt()
  
   return jsonify({'message': f'This is an admin-only endpoint. Hello, {claims["role"]}!'})

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
@jwt_required()
def get_applications_for_methodologist(methodologist_id):
    methodologist = Methodologist.query.filter_by(id=methodologist_id).all()
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
        description=data.get('description', '')
    )
    app.security.datastore.find_or_create_role(
        name=new_role.name, permissions={"123"}
    )
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

# @app.route('/users', methods=['POST'])
# def add_user():
#     data = request.json
#     role_name = data.get('role')
#     print(role_name)

#     # Validate role
#     role = Role.query.filter_by(name=role_name).first()
#     if not role:
#         return jsonify({"error": "Invalid role"}), 400

#     new_user = User(
#         email=data['email'],
#         username=data.get('username', ''),
#         password=hash_password(data['password']),
#         active=data.get('active', True),
#         fs_uniquifier=data['fs_uniquifier']
#     )

#     if not app.security.datastore.find_user(email=new_user.email):
#         app.security.datastore.create_user(email=new_user.email,
#                                    password=hash_password(new_user.password),
#                                    roles=[role])
        
#         db_session.commit()
#         return jsonify({"message": "User added", "user": new_user.email})

#     return jsonify({"error": "User already exists"}), 400

@app.route('/users', methods=['POST'])
def add_user():
    data = request.json
    role_name = data.get('role')
    print(role_name)

    # Validate role
    role = Role.query.filter_by(name=role_name).first()
    if not role:
        return jsonify({"error": "Invalid role"}), 400

    # Check if user already exists
    existing_user = app.security.datastore.find_user(email=data['email'])
    if existing_user:
        return jsonify({"error": "User already exists"}), 400

    # Create new User
    new_user = User(
        email=data['email'],
        username=data.get('username', ''),
        password=hash_password(data['password']),
        active=data.get('active', True),
    )

    # Add user to database
    app.security.datastore.create_user(
        email=new_user.email,
        password=new_user.password,
        roles=[role]
    )
    db_session.commit()

    # Add specific role-based entity
    if role_name == 'student':
        group_name = data.get('group_name')
        group = Group.query.filter_by(name=group_name).first()
        if not group:
            return jsonify({"error": "Invalid group name"}), 400

        new_student = Student(user_id=new_user.id, group_id=group.id)
        db_session.add(new_student)
    elif role_name == 'methodologist':
        query_id_select = User.query.filter_by(email=new_user.email).first()
        print(query_id_select)
        new_methodologist = Methodologist(id=query_id_select.id, full_name='pohui')
        db_session.add(new_methodologist)

    # Commit all changes to the database
    db_session.commit()

    return jsonify({"message": "User and role-specific entity added", "user": new_user.email})

# Error handling
@app.errorhandler(400)
def bad_request(error):
    response = jsonify({"error": "Bad request", "message": str(error)})
    response.status_code = 400
    return response


@app.route('/methodologists', methods=['GET'])
def get_methodologists():
    methodologists = Methodologist.query.all()
    methodologists_list = [
        {
            'id': methodologist.id,
            'full_name': methodologist.full_name
        }
        for methodologist in methodologists
    ]
    return jsonify(methodologists_list)
    

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


@app.route('/groups', methods=['POST'])
def add_group():
    data = request.json
    new_group = Group(
        name=data['groupName'],
        methodologist_id=data['methodologist']
    )
    db_session.add(new_group)
    db_session.commit()
    return jsonify({"message": "Group added", "group": new_group.name})
    