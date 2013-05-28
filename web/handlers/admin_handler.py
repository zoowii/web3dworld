# coding: UTF-8
from framework import RequestHandler
import json, os, sys
from flask import render_template, request, redirect, url_for, make_response


class AdminHomeHandler(RequestHandler):
	def GET(self):
		from web.models import Resource

		resources = Resource.query.order_by("create_time desc").all()
		return render_template('admin/resource/index2.html', resources=resources)


class AdminJsonListTypeHandler(RequestHandler):
	def GET(self, type_name):
		from web.models import Resource

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


class AdminJsonListHandler(RequestHandler):
	def GET(self):
		from web.models import Resource

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


class ResourceUploadHandler(RequestHandler):
	def GET(self, *args, **kwargs):
		return render_template('admin/resource/upload2.html')

	def POST(self):
		from web.models import Resource
		from web.helpers import *

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


class ResourceQueryHandler(RequestHandler):
	def GET(self, resource_name):
		from web.models import Resource
		from docs import Blob

		resource = Resource.query.filter_by(name=resource_name).order_by("create_time desc").first()
		blob_key = resource.blob_key
		data = Blob.find_one(blob_key).data
		if resource.type == 'image':
			res = make_response(data)
			res.headers['Content-Type'] = 'image/jpeg'
			return res
		else:
			return data


class ConverterHandler(RequestHandler):
	def GET(self):
		return render_template('admin/resource/convert_obj2.html', title=u'格式转化')

	def POST(self):
		file = request.files['file']
		from web.app import application
		from web.helpers import *

		infilename = os.path.join(application.get_config('UPLOAD_FOLDER'), random_file_name()) + '.obj'
		outfilename = os.path.join(application.get_config('UPLOAD_FOLDER'), random_file_name()) + '.json'
		if file:
			file.save(infilename)
			import extras.convert_obj_three as convert_obj_three
			import json

			try:
				convert_obj_three.convert_ascii(infilename, '', '', outfilename)
				os.remove(infilename)
				url = move_file_to_store(get_file_content(outfilename), os.path.basename(outfilename), 'file',
				                         'file resource my-3d-format')
				os.remove(outfilename)
				result = gen_mesh_obj_json(url)
				converted_obj_json_str = json.dumps(result)
				geom_json_url = move_file_to_store(converted_obj_json_str,
				                                   os.path.basename(outfilename) + '_mesh_obj_json', 'geom',
				                                   'file geom geometry resource my-3d-format')
				return """
				Convert succeefully!
				<br>
				<a href='%s'>View</a>
				""" % (geom_json_url, )
			except UnicodeDecodeError, e:
				return 'convert error, maybe your file is wrong obj file, or using non ascii codec'
		else:
			return 'error happen when upload file'


class StoreSceneHandler(RequestHandler):
	def POST(self):
		from web.models import Resource
		from web.docs import Blob
		from web.app import application
		import base64

		db = application.services['db']
		json_data = json.loads(request.data)
		data = json_data['scene']
		name = json_data['name']
		type = 'scene'
		tags = 'scene json plain'
		blob_key = Blob(json.dumps(data)).save()
		resource = Resource(name=name, type=type, blob_key=blob_key, tags=tags)
		db.session.add(resource)
		db.session.commit()
		resource_url = url_for('resource.get_by_name', resource_name=name)
		resource_url_base64 = base64.encodestring(resource_url)
		view_url = url_for('player', path=resource_url_base64)
		result = json.dumps({
		"success": True,
		"data": {
		"resource_url": resource_url,
		"base64_resource_url": resource_url_base64,
		"resource_id": resource.id,
		"view_url": view_url
		}
		})
		return result