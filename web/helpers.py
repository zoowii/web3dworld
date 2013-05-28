import time


def flatten(l):
	for el in l:
		if hasattr(el, "__iter__") and not isinstance(el, basestring):
			for sub in flatten(el):
				yield sub
		else:
			yield el


def parse_options_header(header):
	headers = map(lambda s: s.strip(), header.split(';'))

	def split_quotes(s):
		if len(s) < 2:
			return s
		if s[0] == s[-1] == '"' or s[0] == s[-1] == '\'':
			return s[1:-2]
		else:
			return s

	def parse_header(s):
		if '=' in s:
			tmp1 = [split_quotes(x) for x in s.split('=')]
			if len(tmp1) < 2:
				return {tmp1: tmp1}
			else:
				return {tmp1[0]: s[len(tmp1[0]) + 2:-1]}
		elif ':' in s:
			tmp1 = [split_quotes(x) for x in s.split(':')]
			if len(tmp1) < 2:
				return {tmp1: tmp1}
			else:
				return {tmp1[0]: s[len(tmp1[0]) + 1]}
		else:
			return {s: s}

	headers = [parse_header(x) for x in headers]
	return headers


def allowed_file(filename):
	from web.app import application
	return '.' in filename and filename.rsplit('.', 1)[1] in application.get_config('ALLOWED_EXTENSIONS')


def datetimeformat(value, format='%H:%M / %d-%m-%Y'):
	return time.strftime(format, time.localtime(value))


def random_file_name():
	import random, hashlib

	r = random.random()
	m = hashlib.md5()
	m.update(str(r))
	return m.hexdigest()


def get_file_content(filepath):
	file = open(filepath)
	data = file.read()
	file.close()
	return data


def move_file_to_store(data, name, type, tags):
	from web.app import application

	db = application.services['db']
	from flask import url_for
	from docs import Blob
	from models import Resource

	blob_key = Blob(data).save()
	resource = Resource(name=name, type=type, blob_key=blob_key, tags=tags)
	db.session.add(resource)
	db.session.commit()
	return url_for('resource.get_by_name', resource_name=name)


def gen_mesh_obj_json(geom_url):
	result = {}
	result['version'] = '0.0.1'
	result['meshName'] = 'mesh_from_obj'
	result['typeName'] = 'mesh from obj'
	result['meshType'] = 'mesh_from_obj'
	result['thumbnailUrl'] = ''
	result['type'] = 'import'
	result['geometry_url'] = geom_url
	result['material'] = {
	'type': 'basic',
	'map': {
	'url': get_default_texture()
	},
	'transparent': True,
	'opacity': 1
	}
	result['receiveShadow'] = True
	result['doubleSided'] = True
	result['castShadow'] = True
	result['position'] = {
	'x': 0,
	'y': 0,
	'z': 0
	}
	result['rotation'] = {
	'x': 0,
	'y': 0,
	'z': 0
	}
	result['scale'] = {
	'x': 1.0,
	'y': 1.0,
	'z': 1.0
	}
	return result


def get_default_texture():
	return "/static/resources/images/shicai/shicai005.jpg"
