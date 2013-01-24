# coding: UTF-8
from application import app, db
from flask_admin import BaseView, Admin, expose
from flask import request, redirect, url_for
from flask_admin.contrib.sqlamodel import ModelView
admin = Admin(app, name=u'后台管理')
from helpers import *
from docs import *

class ResourceView(BaseView):
	def is_accessible(self):
		return True
	@expose('/')
	def index(self):
		from models import *
		resources = Resource.query.all()
		return self.render('admin/resource/index.html', resources=resources)
	@expose('/upload', methods=['GET', 'POST'])
	def upload(self):
		from models import *
		if request.method == 'POST':
			file = request.files['file']
			if file and True: # allowed_file(file.filename):
				data = file.read()
				file.close()
				name = request.form['name']
				tags = request.form['tags']
				blob_key = Blob(data).save()
				resource = Resource(name=name, type='geom', blob_key=blob_key, tags=tags)
				db.session.add(resource)
				db.session.commit()
				return redirect(url_for('resource.index'))
			return 'upload failed'
		else:
			return self.render('admin/resource/upload.html')

	@expose('/get_by_name/<resource_name>')
	def get_by_name(self, resource_name):
		from models import *
		resource = Resource.query.filter_by(name=resource_name).first()
		blob_key = resource.blob_key
		return Blob.find_one(blob_key).data

admin.add_view(ResourceView(u'资源列表', endpoint='resource', category=u'资源管理'))
#from models import Resource
#admin.add_view(ModelView(Resource, db.session))
