# coding: UTF-8
from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
from pymongo import Connection, MongoClient
from gridfs import GridFS
import os, sys

sys.path.append(os.path.join(os.path.dirname(__file__), 'lib'))

application = app = Flask(__name__)
app.config.from_pyfile('config/default_settings.py')
if os.getenv('VCAP_SERVICES'):
	app.config.from_pyfile('config/appfog.py')
else:
	app.config.from_pyfile('config/development.py')

db = SQLAlchemy(app)
mongoClient = MongoClient(host=app.config['MONGODB_HOST'], port=app.config['MONGODB_PORT'])
mongo = mongoClient[app.config['MONGODB_NAME']]
if app.config['MONGODB_USERNAME'] != '':
	# 不考虑登录失败的情况
	mongo.authenticate(app.config['MONGODB_USERNAME'], app.config['MONGODB_PASSWORD'])
fs = GridFS(mongo)

import models
import docs

from views import *
from admin_view import *

if __name__ == '__main__':
	app.run(debug=True)
