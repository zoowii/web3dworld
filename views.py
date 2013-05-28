# coding: UTF-8
from application import app
from flask import render_template, redirect, url_for, request
import os
import base64, json


@app.route('/')
@app.route('/index/')
def index():
	return redirect(url_for('default_player'))

#	return 'hi, welcome to web3dhouse!'

@app.route('/editor/')
def editor():
	return redirect(url_for('scene_editor', path='default'))


@app.route('/editor/<path>')
def scene_editor(path='default'):
	if path == 'default':
		path = url_for('static', filename='resources/scenes/test.json')
	else:
		path = base64.decodestring(path)
	return render_template('editor.html', title=u'3D编辑器', scene_src=path)


@app.route('/editor/scene/store', methods=['POST', 'GET'])
def store_scene_json():
	from models import Resource
	from docs import Blob
	from application import db

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


@app.route('/play/')
def default_player():
	return render_template('player.index.html', title=u'3D展示页面')


@app.route('/play/path=<path>')
def player(path):
	real_path = base64.decodestring(path)
	return render_template('player.html', path=real_path, title=u'3D展示页面')


@app.route('/test')
def test():
	return base64.encodestring("/static/resources/scenes/test2.json")
