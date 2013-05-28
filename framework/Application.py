# coding: UTF-8
import os, sys
from flask import Flask
from task import Task
from request_dispatcher import RequestDispatcher


class Application:
	initialized = False
	config_filepath = '../config/default_settings.py'
	plugins = set([])
	routers = set([])
	routes = {}
	services = {}
	plus_task = Task.empty_task()

	def set_plus(self, plus_task):
		self.plus_task = plus_task

	def set_config(self, filepath):
		self.config_filepath = filepath

	def add_router(self, router):
		self.routers.add(router)

	def install_plugin(self, plugin):
		self.plugins.add(plugin)

	def install_plugins(self, plugins):
		for plugin in plugins:
			self.install_plugin(plugin)

	def initialize(self):
		if self.initialized:
			return
		root_dir = os.path.dirname(os.path.dirname(__file__))
		self.app = Flask(__name__, template_folder=os.path.join(root_dir, 'templates'),
		                 static_folder=os.path.join(root_dir, 'static'))
		self.load_config()
		self.load_plugins()
		self.load_routes()
		self.init_dispatcher()
		self.plus_task.process()
		self.initialized = True

	def load_config(self):
		from framework.config import Config

		default_config = Config.default_config()
		app_config = Config.create(self.config_filepath)
		Config.install(self, default_config)
		Config.install(self, app_config)

	def get_config(self, name):
		return self.app.config.get(name)

	def load_plugins(self):
		from framework.plugin import Plugin

		for plugin in self.plugins:
			Plugin.install(self, plugin)

	def init_dispatcher(self):
		self.dispatcher = RequestDispatcher()
		self.dispatcher.set_application(self)
		self.dispatcher.route()

	def load_routes(self):
		for router in self.routers:
			self.routes.update(router.routes())

	def get_wsgi(self):
		self.initialize()
		return self.app

	def start_server(self, host='127.0.0.1', port=5000, debug=True):
		self.initialize()
		self.app.run(host=host, port=port, debug=debug)

	def log(self, *args, **kwargs):
		self.app.logger.info(args, kwargs)