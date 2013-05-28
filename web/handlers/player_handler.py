# coding: UTF-8
from framework import RequestHandler
from flask import render_template
import base64


class PlayerHandler(RequestHandler):
	def GET(self, path):
		real_path = base64.decodestring(path)
		return render_template('player.html', path=real_path, title=u'3D展示页面')


class DefaultPlayerHandler(RequestHandler):
	def GET(self, *args, **kwargs):
		return render_template('player.index.html', title=u'3D展示页面')