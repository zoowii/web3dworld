# coding: UTF-8
import os
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

		resources = Resource.query.order_by("create_time desc").all()
		return self.render('admin/resource/index.html', resources=resources)

	@expose('/json/list/type/<type_name>')
	def json_list_type(self, type_name):
		from models import *

		resources = Resource.query.order_by("create_time desc").all()
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

		resources = Resource.query.order_by("create_time desc").all()
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
				move_file_to_store(data, name, 'geom', tags)
				return redirect(url_for('resource.index'))
			return 'upload failed'
		else:
			return self.render('admin/resource/upload.html')

	@expose('/get_by_name/<resource_name>')
	def get_by_name(self, resource_name):
		from models import *
		import tempfile, shutil

		resource = Resource.query.filter_by(name=resource_name).order_by("create_time desc").first()
		blob_key = resource.blob_key
		data = Blob.find_one(blob_key).data
		if resource.type == 'image':
			res = make_response(data)
			res.headers['Content-Type'] = 'image/jpeg'
			return res
		else:
			return data

	@expose('/converter/obj', methods=['GET', 'POST'])
	def convert_obj(self):
		if request.method == 'GET':
			return self.render('admin/resource/convert_obj.html', title=u'格式转化')
		file = request.files['file']
		infilename = os.path.join(app.config['UPLOAD_FOLDER'], random_file_name()) + '.obj'
		outfilename = os.path.join(app.config['UPLOAD_FOLDER'], random_file_name()) + '.json'
		if file:
			file.save(infilename)
			import util.convert_obj_three as convert_obj_three
			import json

			try:
				convert_obj_three.convert_ascii(infilename, '', '', outfilename)
				os.remove(infilename)
				url = move_file_to_store(get_file_content(outfilename), os.path.basename(outfilename), 'file', 'file resource my-3d-format')
				os.remove(outfilename)
				result = gen_mesh_obj_json(url)
				converted_obj_json_str = json.dumps(result)
				geom_json_url = move_file_to_store(converted_obj_json_str, os.path.basename(outfilename) + '_mesh_obj_json', 'geom', 'file geom geometry resource my-3d-format')
				return """
				Convert succeefully!
				<br>
				<a href='%s'>View</a>
				""" % (geom_json_url, )
			except UnicodeDecodeError, e:
				return 'convert error, maybe your file is wrong obj file, or using non ascii codec'
		else:
			return 'error happen when upload file'


admin.add_view(ResourceView(u'资源列表', endpoint='resource', category=u'资源管理'))
#from models import Resource
#admin.add_view(ModelView(Resource, db.session))
