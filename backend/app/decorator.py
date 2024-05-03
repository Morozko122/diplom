from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt, jwt_required


def roles_required(*roles):
    def decorator(fn):
        @wraps(fn)
        @jwt_required()
        def wrapper(*args, **kwargs):
            claims = get_jwt()
            if "role" in claims and claims["role"] in roles:
                return fn(*args, **kwargs)
            else:
                return {"error": "У вас нет доступа к этой функции"}, 403
        return wrapper
    return decorator