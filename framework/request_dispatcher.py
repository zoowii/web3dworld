from flask import request


class RequestDispatcher:
	routes = {}

	def __init__(self):
		pass

	def set_application(self, application):
		self.app = application
		self.routes = application.routes

	def route(self):
		for url in self.routes:
			route = self.routes[url]

			def on_request(**kwargs):
				return self.dispatch(request.url_rule.rule, kwargs)

			self.app.app.add_url_rule(url, route.get('name', 'not_set_endpoint'), on_request, methods=route['methods'])

	def dispatch(self, url, params):
		handler_cls = self.routes[url]['handler']
		handler = handler_cls(self.app)
		method = getattr(handler, request.method)
		return apply(method, [], params)