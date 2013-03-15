# coding: UTF-8
from application import app, db
from flask_admin import BaseView, Admin, expose
from flask import request, redirect, url_for, Response, make_response
from flask_admin.contrib.sqlamodel import ModelView

admin = Admin(app, name=u'后台管理')
from helpers import *
from docs import *
import json


class ResourceView(BaseView):
	def is_accessible(self):
		return True

	@expose('/')
	def index(self):
		from models import *

		resources = Resource.query.all()
		return self.render('admin/resource/index.html', resources=resources)

	@expose('/json/list/type/<type_name>')
	def json_list_type(self, type_name):
		from models import *

		resources = Resource.query.all()
		json_array = []
		for r in resources:
			if r.type == type_name:
				json_array.append({
				'id': r.id,
				'name': r.name,
				'tags': r.tags,
				'type': r.type
				})
		return json.dumps(json_array)

	@expose('/json/list')
	def json_list(self):
		from models import *

		resources = Resource.query.all()
		json_array = []
		for r in resources:
			json_array.append({
			'id': r.id,
			'name': r.name,
			'tags': r.tags,
			'type': r.type
			})
		return json.dumps(json_array)

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
		import tempfile, shutil

		resource = Resource.query.filter_by(name=resource_name).first()
		blob_key = resource.blob_key
		data = Blob.find_one(blob_key).data
		if resource.type == 'image':
			res = make_response(data)
			res.headers['Content-Type'] = 'image/jpeg'
			return res
		else:
			return data


admin.add_view(ResourceView(u'资源列表', endpoint='resource', category=u'资源管理'))
#from models import Resource
#admin.add_view(ModelView(Resource, db.session))
