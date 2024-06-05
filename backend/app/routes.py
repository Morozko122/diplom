from app import app
from flask import Flask, jsonify, request
from flask_cors import cross_origin
from flask import jsonify, render_template
from flask import render_template_string
from flask_security import auth_required, permissions_accepted, current_user, hash_password, verify_password
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity,get_jwt, unset_jwt_cookies
from app.decorator import roles_required 
from app.database import db_session
from app.models import Application, User, Role, Student, Group, RolesUsers, ApplicationDormitory, DormitoryWorker
import pyqrcode
import io
from PIL import Image
from flask import Flask, request, jsonify, send_file

jwt = JWTManager(app)

@app.route('/login_user', methods=['POST'])
def login():    
   print(request.json)
   username = request.json.get('username', None)
   password = request.json.get('password', None)

   user = app.security.datastore.find_user(email=username)
  
   if user and verify_password(password, user.password):
       access_token = create_access_token(identity=user.full_name,  additional_claims={"role": user.roles[0].name})
       return jsonify(access_token=access_token, user_role=user.roles[0].name, user_id=user.id), 200
   else:
       return jsonify({"msg": "Invalid username or password"}), 401

@app.route("/logout", methods=["POST"])
def logout():
    resp = jsonify({'logout': True})
    unset_jwt_cookies(resp)
    return resp, 200


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

@app.route('/update_application/<int:application_id>', methods=['PUT'])
def update_application(application_id):
    # Get the data from the request
    data = request.json
    print(data)
    print(data.get('status'))
    application = Application.query.filter_by(id = application_id).all()[0]

        # Check if application exists
    if not application:
        return jsonify({"error": "Application not found"}), 404

        # Update the fields
    if 'personal_number' in data:
        application.personal_number = data.get('personal_number')
    if 'name' in data:
        application.name = data.get('name')
    if 'quantity' in data:
        application.quantity = data.get('quantity')
    if 'status' in data:
        application.status = data.get('status')
    

        # Commit the changes
    db_session.commit()

    return jsonify({"message": "Application updated successfully"})

@app.route('/methodologists/<int:methodologist_id>/applications', methods=['GET'])
@jwt_required()
def get_applications_for_methodologist(methodologist_id):
    #methodologist = Methodologist.query.filter_by(id=methodologist_id).all()
   
    methodologist = User.query.filter_by(id = methodologist_id).all()
    applications = []
   
    for group in methodologist[0].group:
       
        for student in group.students:
            for application in student.applications:
                applications.append({
                    "id": application.id,
                    "personal_number": application.personal_number,
                    "name": application.name,
                    "quantity": application.quantity,
                    "status": application.status,
                    "date": application.date.strftime('%Y-%m-%d %H:%M:%S'),
                    "full_name": student.user.full_name
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
            'username': user.full_name,
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
            'username': user.full_name,
            'roles': [{'id': role.id, 'name': role.name} for role in user.roles]
        }
        for user in users
    ]
    return jsonify(users_list)

@app.route('/users', methods=['POST'])
def add_user():
    data = request.json
    role_name = data.get('role')

    role = Role.query.filter_by(name=role_name).first()
    if not role:
        return jsonify({"error": "Invalid role"}), 400

    existing_user = app.security.datastore.find_user(email=data['email'])
    if existing_user:
        return jsonify({"error": "User already exists"}), 400

    new_user = User(
        email=data['email'],
        full_name=data['username'],
        password=hash_password(data['password']),
        active=data.get('active', True),
    )

    app.security.datastore.create_user(
        email=new_user.email,
        password=new_user.password,
        roles=[role],
        full_name = new_user.full_name
    )
    db_session.commit()

    if role_name == 'student':
        group_id = data.get('group_id')
        group = Group.query.filter_by(id=group_id).first()
        query_id_select = app.security.datastore.find_user(email=new_user.email)
        #query_id_select = User.query.filter_by(email=new_user.email).first() # переделать под datastore
        if not group:
            return jsonify({"error": "Invalid group name"}), 400

        new_student = Student(user_id=query_id_select.id, group_id=group.id)
        db_session.add(new_student)
    elif role_name == 'hostel-employee':
        query_id_select = app.security.datastore.find_user(email=new_user.email)
        worker = DormitoryWorker(
        user_id=query_id_select.id,
        numberDormitory=data['numberDormitory'],
        typeSpecialist=data['typeSpecialist']
        )
        db_session.add(worker)

    db_session.commit()

    return jsonify({"message": "User and role-specific entity added", "user": new_user.email})
#
def add_worker():
    data = request.get_json()
    worker = DormitoryWorker(
        user_id=data['user_id'],
        numberDormitory=data['numberDormitory'],
        typeSpecialist=data['typeSpecialist']
    )
    db_session.add(worker)
    db_session.commit()
    return jsonify(worker.serialize())
#
@app.errorhandler(400)
def bad_request(error):
    response = jsonify({"error": "Bad request", "message": str(error)})
    response.status_code = 400
    return response


@app.route('/methodologists', methods=['GET'])
def get_methodologists():
    role = app.security.datastore.find_role('methodologist')
    role_users = RolesUsers.query.filter_by(role_id = role.id).first()
    methodologists = User.query.filter_by(id = role_users.user_id).all()
    
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
    user.full_name = data.get('username', user.full_name)
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
        user_id=data['methodologist']
    )
    db_session.add(new_group)
    db_session.commit()
    return jsonify({"message": "Group added", "group": new_group.name})

@app.route('/groups', methods=['GET'])
def get_group():
    groups = Group.query.all()
    groups_list =  [
        {
            'id': group.id,
            'name': group.name,
            'methodologist_id': group.user_id,
            'methodologist':group.users.full_name
        }
        for group in groups
    ]
    return jsonify(groups_list)


# Вспомогательные функции сериализации
def serialize_worker(worker):
    return {
        'id': worker.id,
        'user_id': worker.user_id,
        'numberDormitory': worker.numberDormitory,
        'typeSpecialist': worker.typeSpecialist
    }

def serialize_application(application):
    return {
        'id': application.id,
        'personal_number': application.personal_number,
        'description': application.description,
        'typeSpecialist': application.typeSpecialist,
        'numberDormitory': application.numberDormitory,
        'address': application.address,
        'status': application.status,
        'date': application.date.isoformat()
    }

DormitoryWorker.serialize = serialize_worker
ApplicationDormitory.serialize = serialize_application

# Эндпоинты для DormitoryWorker
@app.route('/workers', methods=['GET'])
@app.route('/workers/<int:id>', methods=['GET'])
def get_workers(id=None):
    if id:
        worker = DormitoryWorker.query.get(id)
        if worker:
            return jsonify(worker.serialize())
        return {'message': 'Dormitory Worker not found'}, 404
    workers = DormitoryWorker.query.all()
    return jsonify([worker.serialize() for worker in workers])

@app.route('/workers', methods=['POST'])
def add_worker():
    data = request.get_json()
    worker = DormitoryWorker(
        user_id=data['user_id'],
        numberDormitory=data['numberDormitory'],
        typeSpecialist=data['typeSpecialist']
    )
    db_session.add(worker)
    db_session.commit()
    return jsonify(worker.serialize())

@app.route('/workers/<int:id>', methods=['PUT'])
def edit_worker(id):
    data = request.get_json()
    worker = DormitoryWorker.query.get(id)
    if not worker:
        return {'message': 'Dormitory Worker not found'}, 404
    worker.user_id = data.get('user_id', worker.user_id)
    worker.numberDormitory = data.get('numberDormitory', worker.numberDormitory)
    worker.typeSpecialist = data.get('typeSpecialist', worker.typeSpecialist)
    db_session.commit()
    return jsonify(worker.serialize())

# Эндпоинты для ApplicationDormitory
@app.route('/applicationDormitory', methods=['GET'])
@app.route('/applicationDormitory/<int:id>', methods=['GET'])
def get_applicationDormitory(id=None):
    if id:
        application = ApplicationDormitory.query.get(id)
        if application:
            return jsonify(application.serialize())
        return {'message': 'Application Dormitory not found'}, 404
    applications = ApplicationDormitory.query.all()
    return jsonify([app.serialize() for app in applications])

@app.route('/applicationDormitory/add', methods=['POST'])
def add_applicationDormitory():
    data = request.get_json()
    application = ApplicationDormitory(
        personal_number=data['personal_number'],
        description=data['description'],
        typeSpecialist=data['typeSpecialist'],
        numberDormitory=data['numberDormitory'],
        address=data['address'],
        status=data['status'],
        
    )
    db_session.add(application)
    db_session.commit()
    return jsonify(application.serialize())

@app.route('/applicationDormitory/<int:id>', methods=['PUT'])
def edit_applicationDormitory(id):
    data = request.get_json()
    application = ApplicationDormitory.query.get(id)
    if not application:
        return {'message': 'Application Dormitory not found'}, 404
    application.personal_number = data.get('personal_number', application.personal_number)
    application.description = data.get('description', application.description)
    application.typeSpecialist = data.get('typeSpecialist', application.typeSpecialist)
    application.numberDormitory = data.get('numberDormitory', application.numberDormitory)
    application.address = data.get('address', application.address)
    application.status = data.get('status', application.status)
    db_session.commit()
    return jsonify(application.serialize())



@app.route('/generate_qr', methods=['GET'])
def generate_qr():
    user_id = request.args.get('user_id')
    
    
    qr_code = pyqrcode.create(user_id)
    buffer = io.BytesIO()
    qr_code.png(buffer, scale=5)
    buffer.seek(0)

    return send_file(buffer, mimetype='image/png')