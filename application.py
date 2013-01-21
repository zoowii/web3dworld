from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
import os, sys

application = app = Flask(__name__)
app.config.from_object('settings.DevelopmentConfig')
db = SQLAlchemy(app)
import models
import views
try:
	db.create_all()
except:
	print 'create db tables error'
	sys.exit(1)

print __name__
if __name__ == '__main__':
	app.run('0.0.0.0', debug=True)