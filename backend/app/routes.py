from app import app
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import cross_origin
from flask import jsonify, render_template
from flask import render_template_string
from flask_security import auth_required, permissions_accepted, current_user, hash_password, verify_password
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity,get_jwt, unset_jwt_cookies, verify_jwt_in_request
from app.decorator import roles_required 
from app.database import db_session
from app.models import Application, User, Role, Student, Group, RolesUsers, ApplicationDormitory, DormitoryWorker, StudentInDormitory
import pyqrcode
import io
from PIL import Image
from flask import Flask, request, jsonify, send_file
from datetime import timedelta
from werkzeug.utils import secure_filename
import os

jwt = JWTManager(app)

@app.route('/login_user', methods=['POST'])
def login():    
   print(request.json)
   username = request.json.get('username', None)
   password = request.json.get('password', None)

   user = app.security.datastore.find_user(email=username)
  
   if user and verify_password(password, user.password):
       access_token = create_access_token(identity=user.full_name,  additional_claims={"role": user.roles[0].name}, expires_delta=timedelta(hours=5))
       return jsonify(access_token=access_token, user_role=user.roles[0].name, user_id=user.id), 200
   else:
       return jsonify({"msg": "Invalid username or password"}), 401

@app.route("/logout", methods=["POST"])
def logout():
    resp = jsonify({'logout': True})
    unset_jwt_cookies(resp)
    return resp, 200

@app.route('/check_token', methods=['GET'])
@jwt_required()
def check():
     return "1"


#______________Роли_____________________#
@app.route('/roles', methods=['GET'])
@roles_required(['admin'])
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
@roles_required(['admin'])
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
@roles_required(['admin'])
def edit_role(role_id):
    data = request.json
    role = Role.query.filter_by(id =role_id)
    role.name = data.get('name', role.name)
    role.description = data.get('description', role.description)
    role.permissions = data.get('permissions', role.permissions)
    db_session.commit()
    return jsonify({"message": "Role updated", "role": role.name})

#___________________________________#

#______________Users_____________________#

@app.route('/users', methods=['GET'])
@roles_required('admin')
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
@jwt_required()
def get_users_id(user_id):
    users = User.query.filter_by(id = user_id).first()
    users_list = {
        'id': users.id,
        'email': users.email,
        'full_name': users.full_name,
        'roles': [{'id': role.id, 'name': role.name} for role in users.roles]
    }
        
    return jsonify(users_list)

@app.route('/users/<int:user_id>/fullinfo', methods=['GET'])
@roles_required('admin')
def get_users_id_full_info(user_id):
    users = User.query.filter_by(id = user_id).first()
    
    users_list = {
        'id': users.id,
        'email': users.email,
        'full_name': users.full_name,
        'roles': [{'id': role.id, 'name': role.name} for role in users.roles]
    }
    users_list['role']= users_list["roles"][0]['name']
    if (any(role.get('name') == "student" for role in users_list["roles"])):
        users_list["group_id"] = users.student.group.id
        users_list["group_name"] = users.student.group.name
        users_list["liveInDormitory"] = str(users.student.liveInDormitory)
        if(users.student.liveInDormitory):
            users_list["numberDormitory"] = users.student.studentInDormitory.numberDormitory
            users_list["numberRoom"] = users.student.studentInDormitory.numberRoom
    if (any(role.get('name') == "hostel-employee" for role in users_list["roles"])):
        users_list["numberDormitory"] = users.dormitoryWorker.numberDormitory
        users_list["typeSpecialist"] = users.dormitoryWorker.typeSpecialist
        
    return jsonify(users_list)

@app.route('/users', methods=['POST'])
@roles_required('admin')
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
        full_name=data['full_name'],
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
        if not group:
            return jsonify({"error": "Invalid group name"}), 400
        
        new_student = Student(user_id=query_id_select.id, group_id=group.id, liveInDormitory=data.get('liveInDormitory') == 'True' )
        db_session.add(new_student)
        if(data.get('liveInDormitory') == 'True'):
            new_StudentInDormitory = StudentInDormitory(user_id=query_id_select.id, numberDormitory = data.get('numberDormitory'), numberRoom =data.get('numberRoom'))
            db_session.add(new_StudentInDormitory)
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

@app.route('/users/<int:user_id>/full', methods=['PUT'])
@roles_required('admin')
def edit_user_full(user_id):
    data = request.json
    
    role_name = data.get('role')
    role = Role.query.filter_by(name=role_name).first()
    if not role:
        return jsonify({"error": "Invalid role"}), 400
    
    existing_user = app.security.datastore.find_user(id=user_id)
    print(existing_user)
    for key, value in data.items():
        if hasattr(existing_user, key) and (key != "password" and value !='') and value !='':
            setattr(existing_user, key, value)
        elif key == "password" and value !='':
            setattr(existing_user, key, hash_password(value))
            
    db_session.commit()
    
   

    return jsonify({"message": "User updated", "user": existing_user.email})

@app.route('/users/<int:user_id>', methods=['PUT'])
@roles_required('admin')
def edit_user(user_id):
    data = request.json
    user = User.query.filter_by(id = user_id)
    
    for key, value in data.items():
        if hasattr(user, key):
            setattr(user, key, value)
    db_session.commit()
    return jsonify({"message": "User updated", "user": user.email})

#___________________________________#

#______________Справки_____________________#

@app.route('/get_applications/<int:student_code>', methods=['GET'])
@roles_required('admin', 'methodologist', 'student')
def get_applications(student_code):
    applications = Application.query.filter_by(personal_number=student_code).all()
    if not applications:
        return jsonify({"message": "No applications found for this student"}), 404
    
    result = [
        {
            "id": application.id,
            "personal_number": application.personal_number,
            "name": application.name,
            "quantity": application.quantity,
            "status": application.status,
            "date": application.date.strftime('%Y-%m-%d %H:%M:%S')
        } for application in applications
    ]
    return jsonify(result), 200

@app.route('/applications/add', methods=['POST'])
@roles_required('admin', 'student')
def add_application():
    data = request.json
    personal_number = data.get('personal_number')
    name = data.get('name')
    quantity = data.get('quantity')
    status = "Ожидание"
    

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
@roles_required('admin', 'methodologist')
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
    for key, value in data.items():
        if hasattr(application, key):
            setattr(application, key, value)
    

        # Commit the changes
    db_session.commit()

    return jsonify({"message": "Application updated successfully"})

#___________________________________#

#______________Методисты_____________________#
@app.route('/methodologists/<int:methodologist_id>/applications', methods=['GET'])
@roles_required('admin', 'methodologist')
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
    applications.sort(key=lambda x: x["id"], reverse=True)
    
    return jsonify(applications)

@app.route('/methodologists', methods=['GET'])
@roles_required('admin')
def get_methodologists():
    role = app.security.datastore.find_role('methodologist')
    role_users = RolesUsers.query.filter_by(role_id=role.id).all()
    user_ids = [role_user.user_id for role_user in role_users]
    methodologists = User.query.filter(User.id.in_(user_ids)).all()
    methodologists_list = [
        {
            'id': methodologist.id,
            'full_name': methodologist.full_name
        }
        for methodologist in methodologists
    ]
    return jsonify(methodologists_list)

#___________________________________#

#______________Общежитие _____________________#  
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
        'date': application.date.strftime('%Y-%m-%d %H:%M:%S')
    }

DormitoryWorker.serialize = serialize_worker
ApplicationDormitory.serialize = serialize_application

#______________Работники общаги_____________________#

@app.route('/workers', methods=['GET'])
@app.route('/workers/<int:id>', methods=['GET'])
@roles_required('admin')
def get_workers(id=None):
    if id:
        worker = DormitoryWorker.query.get(id)
        if worker:
            return jsonify(worker.serialize())
        return {'message': 'Dormitory Worker not found'}, 404
    workers = DormitoryWorker.query.all()
    return jsonify([worker.serialize() for worker in workers])

@app.route('/workers', methods=['POST'])
@roles_required('admin')
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
@roles_required('admin')
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

@app.route('/workers/<int:id>/applications', methods=['GET'])
@roles_required('admin', 'hostel-employee')
def get_worker_app(id):
    worker = DormitoryWorker.query.filter_by(user_id = id).first()
    if not worker:
        return {'message': 'Dormitory Worker not found'}, 404
    
    listApp = ApplicationDormitory.query.filter_by(typeSpecialist =worker.typeSpecialist , numberDormitory =worker.numberDormitory).all()
    if listApp:
        applications = []
        for app in listApp:
            applications.append(app.serialize())
        applications.sort(key=lambda x: x["id"], reverse=True)
        return jsonify(applications)
    return {'message': 'Application Dormitory not found'}, 404

#___________________________________#

#______________Заявки в общаге_____________________#
    
@app.route('/applicationDormitory', methods=['GET'])
@app.route('/applicationDormitory/<int:id>', methods=['GET'])
@roles_required('admin', 'hostel-employee')
def get_applicationDormitory(id=None):
    if id:
        application = ApplicationDormitory.query.get(id)
        if application:
            return jsonify(application.serialize())
        return {'message': 'Application Dormitory not found'}, 404
    applications = ApplicationDormitory.query.all()
    return jsonify([app.serialize() for app in applications])

@app.route('/applicationDormitory/student/<int:id>', methods=['GET'])
@roles_required('admin', 'hostel-employee', 'student')
def get_applicationDormitory_std(id):
    
    if id:
        applications =  ApplicationDormitory.query.filter_by(personal_number = id).all()
   
        result = [
        {
        'id': application.id,
        'personal_number': application.personal_number,
        'description': application.description,
        'typeSpecialist': application.typeSpecialist,
        'numberDormitory': application.numberDormitory,
        'address': application.address,
        'status': application.status,
        'date': application.date.strftime('%Y-%m-%d %H:%M:%S')
        } for application in applications
    ]
        print(result)
    return jsonify(result), 200
        

@app.route('/applicationDormitory/add', methods=['POST'])
@roles_required('admin', 'student')
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
    return jsonify({"message": "Application added successfully"}), 201

@app.route('/applicationDormitory/<int:id>', methods=['PUT'])
@roles_required('admin', 'hostel-employee')
def edit_applicationDormitory(id):
    data = request.get_json()
    application = ApplicationDormitory.query.get(id)
    if not application:
        return {'message': 'Application Dormitory not found'}, 404
    
    for key, value in data.items():
        if hasattr(application, key):
            setattr(application, key, value)
            
    db_session.commit()
    return jsonify(application.serialize())

#___________________________________#
    
#______________Группы_____________________#

@app.route('/groups', methods=['POST'])
@roles_required('admin')

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
@roles_required('admin')
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

#___________________________________#


@app.route('/generate_qr/<int:id>', methods=['GET'])
@roles_required('admin', 'student')
def generate_qr(id):
    
    student = Student.query.get(id)
    studentInDormitory= student.studentInDormitory
    if(student !=None and student.liveInDormitory):
        access_token = create_access_token(identity=student.user_id ,additional_claims={"numberDormitory": studentInDormitory.numberDormitory , "numberRoom": studentInDormitory.numberRoom}, expires_delta=timedelta(seconds=120))
        return access_token, 200
        
    return {'message': 'В доступе отказано'}, 401

# @jwt_required()
@app.route('/enter_dormitory', methods=['GET'])
@roles_required('admin', 'student')
def enter_dormitory():
    verify_jwt_in_request()
    id = get_jwt_identity()
    claims = get_jwt()
    if "numberDormitory" in claims and "numberRoom" in claims:
        numberDormitory = claims["numberDormitory"]
        numberRoom = claims["numberRoom"]
        student = StudentInDormitory.query.get(id)
        if (student.numberDormitory ==numberDormitory and student.numberRoom == numberRoom ):
            return {"enter": True}
        else: return {"enter": False}
        
    return {'message': 'Ошибка входа'}, 401



@app.errorhandler(400)
def bad_request(error):
    response = jsonify({"error": "Bad request", "message": str(error)})
    response.status_code = 400
    return response


#тест карты
@app.route('/files/<filename>', methods=['GET'])
def get_file(filename):
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    print(file_path)
    if os.path.exists(file_path):
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
    else:
        return jsonify({'error': 'File not found'}), 404

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file:
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        
        return jsonify({'message': 'File successfully uploaded'}), 200
    

