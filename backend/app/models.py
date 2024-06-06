# from app.database import Base
# from datetime import datetime
# from flask_security import UserMixin, RoleMixin, AsaList
# from sqlalchemy.orm import relationship, backref
# from sqlalchemy.ext.mutable import MutableList
# from sqlalchemy import Boolean, DateTime, Column, Integer, \
#                     String, ForeignKey

# class RolesUsers(Base):
#     __tablename__ = 'roles_users'
#     id = Column(Integer(), primary_key=True)
#     user_id = Column('user_id', Integer(), ForeignKey('user.id'))
#     role_id = Column('role_id', Integer(), ForeignKey('role.id'))

# class Role(Base, RoleMixin):
#     __tablename__ = 'role'
#     id = Column(Integer(), primary_key=True)
#     name = Column(String(80), unique=True)
#     description = Column(String(255))
#     permissions = Column(MutableList.as_mutable(AsaList()), nullable=True)

# class User(Base, UserMixin):
#     __tablename__ = 'user'
#     id = Column(Integer, primary_key=True)
#     email = Column(String(255), unique=True)
#     username = Column(String(255), unique=True, nullable=True)
#     password = Column(String(255), nullable=False)
#     active = Column(Boolean())
#     fs_uniquifier = Column(String(64), unique=True, nullable=False)
#     roles = relationship('Role', secondary='roles_users',
#                          backref=backref('users', lazy='dynamic'))

# class Group(Base):
#     __tablename__ = 'group'
    
#     id = Column(Integer, primary_key=True)
#     name = Column(String, nullable=False)
#     methodologist_id = Column(Integer, ForeignKey('methodologist.id'), nullable=False)
    
#     methodologist = relationship("Methodologist", back_populates="groups")
#     students = relationship("Student", back_populates="group")

# class Methodologist(Base):
#     __tablename__ = 'methodologist'
    
#     id = Column(Integer, primary_key=True)
#     full_name = Column(String, nullable=False)
    
#     groups = relationship("Group", back_populates="methodologist")

# class Student(Base):
#     __tablename__ = 'student'
#     #добавить id
#     personal_number = Column(Integer, primary_key=True)
#     group_id = Column(Integer, ForeignKey('group.id'))
    
#     group = relationship("Group", back_populates="students")
#     applications = relationship("Application", back_populates="student")

# class Application(Base):
#     __tablename__ = 'application'
    
#     id = Column(Integer, primary_key=True)
#     personal_number = Column(Integer, ForeignKey('student.personal_number'))
#     name = Column(String, nullable=False)
#     quantity = Column(Integer, nullable=False)
#     status = Column(String, nullable=False)
#     date = Column(DateTime, nullable=False, default=datetime.utcnow)
    
#     student = relationship("Student", back_populates="applications")

# # Update the bidirectional relationship attributes
# Group.students = relationship("Student", back_populates="group")
# Student.group = relationship("Group", back_populates="students")
# Student.applications = relationship("Application", back_populates="student")
# Application.student = relationship("Student", back_populates="applications")


from app.database import Base
from datetime import datetime
from flask_security import UserMixin, RoleMixin, AsaList
from sqlalchemy.orm import relationship, backref
from sqlalchemy.ext.mutable import MutableList
from sqlalchemy import Boolean, DateTime, Column, Integer, String, ForeignKey

class RolesUsers(Base):
    __tablename__ = 'roles_users'
    id = Column(Integer(), primary_key=True)
    user_id = Column('user_id', Integer(), ForeignKey('user.id'))
    role_id = Column('role_id', Integer(), ForeignKey('role.id'))

class Role(Base, RoleMixin):
    __tablename__ = 'role'
    id = Column(Integer(), primary_key=True)
    name = Column(String(80), unique=True)
    description = Column(String(255))
    permissions = Column(MutableList.as_mutable(AsaList()), nullable=True)

class User(Base, UserMixin):
    __tablename__ = 'user'
    id = Column(Integer, primary_key=True)
    email = Column(String(255), unique=True)
    full_name = Column(String, nullable=True)
    password = Column(String(255), nullable=False)
    active = Column(Boolean())
    fs_uniquifier = Column(String(64), unique=True, nullable=False)
    
    roles = relationship('Role', secondary='roles_users', backref=backref('users', lazy='dynamic'))
    group = relationship('Group', back_populates='users')
    student = relationship('Student', uselist=False, back_populates='user')
    dormitoryWorker = relationship('DormitoryWorker',uselist=False, back_populates='userss')

class Group(Base):
    __tablename__ = 'group'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    user_id = Column(Integer, ForeignKey('user.id'), nullable=True)
    
    users = relationship("User", back_populates="group")
    students = relationship("Student", back_populates="group")


class Student(Base):
    __tablename__ = 'student'
    group_id = Column(Integer, ForeignKey('group.id'))
    user_id = Column(Integer, ForeignKey('user.id'), nullable=False, primary_key=True)
    liveInDormitory = Column(Boolean, nullable=False)
    group = relationship("Group", back_populates="students")
    applications = relationship("Application", back_populates="student")
    applicationDormitory = relationship("ApplicationDormitory", back_populates="student")
    user = relationship("User", back_populates="student")
    studentInDormitory = relationship("StudentInDormitory",uselist=False, back_populates="student")
    
class StudentInDormitory(Base):
     __tablename__ = 'studentInDormitory'
     user_id = Column(Integer, ForeignKey('student.user_id'), nullable=False, primary_key=True)
     numberDormitory = Column(Integer, nullable=False)
     numberRoom= Column(Integer, nullable=False)
     student = relationship("Student",uselist=False, back_populates="studentInDormitory")

class Application(Base):
    __tablename__ = 'application'
    id = Column(Integer, primary_key=True)
    personal_number = Column(Integer, ForeignKey('student.user_id'))
    name = Column(String, nullable=False)
    quantity = Column(Integer, nullable=False)
    status = Column(String, nullable=False)
    date = Column(DateTime, nullable=False, default=datetime.utcnow)
    student = relationship("Student", back_populates="applications")
    
class DormitoryWorker(Base):
     __tablename__ = 'dormitoryWorker'
     id = Column(Integer, primary_key=True)
     user_id = Column(Integer, ForeignKey('user.id'), nullable=False)
     numberDormitory = Column(Integer, nullable=False)
     typeSpecialist = Column(String, nullable=False)
     userss = relationship("User", back_populates="dormitoryWorker")
     
class ApplicationDormitory(Base):
    __tablename__ = 'applicationDormitory'
    id = Column(Integer, primary_key=True)
    personal_number = Column(Integer, ForeignKey('student.user_id'))
    description = Column(String, nullable=False)
    typeSpecialist = Column(String, nullable=False)
    numberDormitory = Column(Integer, nullable=False)
    address = Column(String, nullable=False)
    status = Column(String, nullable=False)
    date = Column(DateTime, nullable=False, default=datetime.utcnow)
    
    student = relationship("Student", back_populates="applicationDormitory")
     
     
Group.students = relationship("Student", back_populates="group")
Student.group = relationship("Group", back_populates="students")
Student.applications = relationship("Application", back_populates="student")
Application.student = relationship("Student", back_populates="applications")