from flask import Flask
from flask_cors import CORS
from app.views import *
from app.database import init_app

#inicializacion del proyecto Flask
app = Flask(__name__)

init_app(app)
CORS(app, allow_all_origins=True)

app.route('/', methods=['GET'])(index)
app.route('/api/user/', methods=['POST'])(create_user)
app.route('/api/user/<int:user_id>', methods=['GET'])(get_user)
app.route('/api/user/<int:user_id>', methods=['PUT'])(update_user)
app.route('/api/user/<int:user_id>', methods=['DELETE'])(delete_user)

if __name__=='__main__':
    app.run(debug=True)