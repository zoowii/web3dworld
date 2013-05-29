# coding: UTF-8
import os, sys
from framework import Application, RequestHandler, Router
from plugins import DbPlugin, MongoPlugin, TemplatePlugin, FileStoragePlugin, ObjThreeConverterPlugin
from urls import AppRouter
from tasks import LoadTask

application = Application()
if os.getenv('VCAP_SERVICES'):
	application.set_config('../config/appfog.py')
else:
	application.set_config('../config/development.py')

application.install_plugins([DbPlugin, MongoPlugin, TemplatePlugin, FileStoragePlugin, ObjThreeConverterPlugin])


application.add_router(AppRouter())

application.set_plus(LoadTask())
