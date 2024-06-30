from app.database import get_db

class User:
    #definir constuctor de la clase
    def __init__(self,id_user=None,name=None,password=None,email=None,rol=None,phone=None):
        self.id_user=id_user
        self.name=name
        self.password=password
        self.email=email
        self.rol=rol
        self.phone=phone
        
    #definir metodo serialize
    def serialize(self):
        return {
            'id_user': self.id_user,
            'name': self.name,
            'password': self.password,
            'email': self.email,
            'rol': self.rol,
            'phone': self.phone
        }
    
    #definir metodo estatico de la clase para mostrar todo los usuarios
    @staticmethod
    def get_all():
        db = get_db()
        cursor = db.cursor()
        query = "SELECT * FROM user"
        cursor.execute(query)
        rows = cursor.fetchall()
        users = [User(id_user=row[0], name=row[1], password=row[2], email=row[3], rol=row[4], phone=row[5]) for row in rows]
        cursor.close()
        return users
        
    #definir metodo estatico de la clase para buscar un user por codigo
    @staticmethod
    def get_by_id(user_id):
        db = get_db()
        cursor = db.cursor()
        cursor.execute("SELECT * FROM user WHERE id_user = %s", (user_id,))
        row = cursor.fetchone()
        cursor.close()
        if row:
            return User(id_user=row[0], name=row[1], password=row[2], email=row[3], rol=row[4], phone=row[5])
        return None    
    
    #definir metodo para insertar una fila si no existe, en su defecto actualiza
    def save(self):
        db = get_db()
        cursor = db.cursor()
        if self.id_user:
            cursor.execute("""
                UPDATE user SET name = %s, password = %s, email = %s, rol = %s, phone = %s
                WHERE id_user = %s
            """, (self.name, self.password, self.email, self.rol, self.phone, self.id_user))
        else:
            cursor.execute("""
                INSERT INTO user (name, password, email, rol, phone) VALUES (%s, %s, %s, %s, %s)
            """, (self.name, self.password, self.email, self.rol, self.phone))
            self.id_user = cursor.lastrowid
        db.commit()
        cursor.close()

    #definir metodo para borrar una fila
    def delete(self):
        db = get_db()
        cursor = db.cursor()
        cursor.execute("DELETE FROM user WHERE id_user = %s", (self.id_user,))
        db.commit()
        cursor.close()
