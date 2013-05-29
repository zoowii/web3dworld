# coding: UTF-8
from framework import Plugin
import time


class DbPlugin(Plugin):
	def process(self):
		from flask.ext.sqlalchemy import SQLAlchemy

		db = SQLAlchemy(self.app.app)
		self.services['db'] = db

	def after_process(self):
		# import web.models
		pass


class MongoPlugin(Plugin):
	def process(self):
		from pymongo import Connection, MongoClient
		from gridfs import GridFS

		mongoClient = MongoClient(host=self.app.get_config('MONGODB_HOST'), port=self.app.get_config('MONGODB_PORT'))
		mongo = mongoClient[self.app.get_config('MONGODB_NAME')]
		if self.app.get_config('MONGODB_USERNAME') != '':
			# 不考虑登录失败的情况
			mongo.authenticate(self.app.get_config('MONGODB_USERNAME'), self.app.get_config('MONGODB_PASSWORD'))
		fs = GridFS(mongo)
		self.services['mongo'] = mongo
		self.services['fs'] = fs


class TemplatePlugin(Plugin):
	def after_process(self):
		def datetimeformat(value, format='%H:%M / %d-%m-%Y'):
			return time.strftime(format, time.localtime(value))

		env = self.app.app.jinja_env
		env.filters['datetimeformat'] = datetimeformat


class FileStoragePlugin(Plugin):
	def process(self):
		from web.extras.file_storage import FileStorage, MongoStorageStrategy

		filestorage = FileStorage(self.app)
		filestorage.set_strategy(MongoStorageStrategy)
		self.services['filestorage'] = filestorage


class ObjThreeConverterPlugin(Plugin):
	def process(self):
		import web.extras.convert_obj_three as convert_obj_three

		self.services['obj_three_converter'] = convert_obj_three