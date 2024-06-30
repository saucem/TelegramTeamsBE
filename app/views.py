from flask import jsonify, request
from app.models import User

def index():
    return '<h1>TelegramTeams - BACK END 🐍</h1>'

#difinir funcion para recuperar usuarios
def get_all_users():
    users = User.get_all()
    list_users = [user.serialize() for user in users]
    return jsonify(list_users)

#definir funcion para guardar datos de usuario
def create_user():    
    data = request.json
    new_user = User(
        name=data['name'],
        password=data['password'],
        email=data['email'],
        rol=data['rol'],
        phone=data['phone']
    )
    new_user.save()
    return jsonify({'message':'Usuario creado con exito!'}), 201
    
#definir funcion para actualizar datos de usuario    
def update_user(user_id):
    user = User.get_by_id(user_id)
    if not user:
        return jsonify({'message': 'Usuario no encontrado!'}), 404
    data = request.json
    user.name = data['name']
    user.password = data['password']
    user.email = data['email']
    user.rol = data['rol']
    user.phone = data['phone']
    user.save()
    return jsonify({'message': 'Usuario actualizado correctamente!'})

#definir funcion para buscar un usuario    
def get_user(user_id):
    user = User.get_by_id(user_id)
    if not user:
        return jsonify({'message': 'Usuario no encontrado!'}), 404
    return jsonify(user.serialize())

#definir funcion para borrar un usuario    
def delete_user(user_id):
    user = User.get_by_id(user_id)
    if not user:
        return jsonify({'message': 'Usuario no encontrado!'}), 404
    user.delete()
    return jsonify({'message': 'Usuario borrado correctamente!'})