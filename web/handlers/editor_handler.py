# coding: UTF-8
from framework import RequestHandler
from flask import redirect, url_for, render_template
import base64


class EditorHandler(RequestHandler):
	def GET(self, *args, **kwargs):
		return redirect(url_for('scene_editor', path='default'))


class SceneEditorHandler(RequestHandler):
	def GET(self, path):
		if path == 'default':
			path = url_for('static', filename='resources/scenes/test.json')
		else:
			path = base64.decodestring(path)
		return render_template('editor.html', title=u'3D编辑器', scene_src=path)
