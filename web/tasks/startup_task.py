from framework import Task
import os, sys
from web.util import *


class InitDbTask(Task):
	def process(self):
		from web import models, docs
		from web.app import application

		db = application.services['db']
		root_dir = os.path.dirname(__file__)
		resources_dir = os.path.join(root_dir, 'static', 'resources')
		filepaths = listDirRec(resources_dir)
		files = []

		def getFileInfo(path):
			relativePath = path.replace(resources_dir + os.path.sep, '').replace('\\', '/')
			tmp = filter(lambda x: x != '', relativePath.split('/'))
			pathname = '.'.join(tmp)
			filename = tmp[-1]
			return {
			"path": path,
			"relativePath": relativePath,
			"pathname": pathname,
			"filename": filename
			}

		def saveFileInfoToDb(fileInfo):
			is_binary = False
			if endsWithOneInArray(fileInfo['filename'].lower(), ['jpg', 'png', 'ico', 'jpeg', 'bmp']):
				file_type = 'image'
				is_binary = True
			if is_binary:
				f = open(fileInfo['path'], 'rb')
			else:
				f = open(fileInfo['path'], 'r')
			data = f.read()
			f.close()
			blob_key = docs.Blob(data).save()
			file_type = 'file'
			if endsWithOneInArray(fileInfo['filename'].lower(), ['jpg', 'png', 'ico', 'jpeg', 'bmp']):
				file_type = 'image'
			resource = models.Resource(name=fileInfo['pathname'], type=file_type, blob_key=blob_key,
			                           tags="file resource my-3d-format")
			db.session.add(resource)
			db.session.commit()
			return True
		try:
			db.drop_all()
			db.create_all()
		except:
			pass


class StartupTask(Task):
	def process(self):
		init_db_task = InitDbTask()
		init_db_task.process()