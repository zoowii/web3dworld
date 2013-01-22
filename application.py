from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
from mongokit import Connection, Document
import os, sys

application = app = Flask(__name__)
app.config.from_pyfile('config/default_settings.py')
if os.getenv('VCAP_SERVICES'):
	app.config.from_pyfile('config/appfog.py')
else:
	app.config.from_pyfile('config/development.py')

db = SQLAlchemy(app)
mongo_conn = Connection(app.config['MONGODB_HOST'],
                   app.config['MONGODB_PORT'])
mongo = mongo_conn[app.config['MONGODB_NAME']]

import models
import docs

from views import *
from admin_view import *

if __name__ == '__main__':
	app.run(debug=True)
