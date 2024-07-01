from app.database import get_db

class User:
    #definir constuctor de la clase
    def __init__(self,id=None,name=None,password=None,email=None,role=None,telephone=None):
        self.id=id
        self.name=name
        self.password=password
        self.email=email
        self.role=role
        self.telephone=telephone
        
    #definir metodo serialize
    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'password': self.password,
            'email': self.email,
            'role': self.role,
            'telephone': self.telephone
        }
    
    #definir método estático de la clase para mostrar todo los usuarios
    @staticmethod
    def get_all():
        db = get_db()
        cursor = db.cursor()
        query = "SELECT * FROM user"
        cursor.execute(query)
        rows = cursor.fetchall()
        users = [User(id=row[0], name=row[1], password=row[2], email=row[3], role=row[4], telephone=row[5]) for row in rows]
        cursor.close()
        return users
        
    #definir método estático de la clase para buscar un user por código
    @staticmethod
    def get_by_id(user_id):
        db = get_db()
        cursor = db.cursor()
        cursor.execute("SELECT * FROM user WHERE id = %s", (user_id,))
        row = cursor.fetchone()
        cursor.close()
        if row:
            return User(id=row[0], name=row[1], password=row[2], email=row[3], role=row[4], telephone=row[5])
        return None    
    
    #definir metodo para insertar una fila si no existe, en su defecto actualiza
    def save(self):
        db = get_db()
        cursor = db.cursor()
        if self.id:
            cursor.execute("""
                UPDATE user SET name = %s, password = %s, email = %s, role = %s, telephone = %s
                WHERE id = %s
            """, (self.name, self.password, self.email, self.role, self.telephone, self.id))
        else:
            cursor.execute("""
                INSERT INTO user (name, password, email, role, telephone) VALUES (%s, %s, %s, %s, %s)
            """, (self.name, self.password, self.email, self.role, self.telephone))
            self.id = cursor.lastrowid
        db.commit()
        cursor.close()

    #definir método para borrar una fila
    def delete(self):
        db = get_db()
        cursor = db.cursor()
        cursor.execute("DELETE FROM user WHERE id = %s", (self.id,))
        db.commit()
        cursor.close()
