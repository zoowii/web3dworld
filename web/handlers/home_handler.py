from framework import RequestHandler
from flask import redirect, url_for


class HomeHandler(RequestHandler):
	def GET(self):
		return redirect(url_for('default_player'))