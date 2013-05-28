from web.app import application
from mongokit import ObjectId

mongo = application.services['mongo']
fs = application.services['fs']


class Blob(object):
	def __init__(self, data):
		self.data = data

	def read(self):
		return self.data

	def save(self):
		f = fs.new_file()
		f.write(self.data)
		id = f._id
		f.close()
		return str(id)  # str(blob_collection.insert({"data": self.data}))

	@staticmethod
	def find_one(id):
		f = fs.get(ObjectId(id))
		if f:
			blob = Blob(f.read())
			return blob
		else:
			return None
