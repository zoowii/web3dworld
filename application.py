from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
import os, sys

application = app = Flask(__name__)
app.config.from_pyfile('config/default_settings.py')
if os.getenv('VCAP_SERVICES'):
	app.config.from_pyfile('config/appfog.py')
else:
	app.config.from_pyfile('config/development.py')
db = SQLAlchemy(app)
import models
import views


try:
	db.create_all()
except:
	print 'create db tables error'
	sys.exit(1)

if __name__ == '__main__':
	app.run(debug=True)
