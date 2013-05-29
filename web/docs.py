from web.app import application
from mongokit import ObjectId

mongo = application.services['mongo']
fs = application.services['fs']
filestorage = application.services['filestorage']

class Blob(object):
	def __init__(self, data):
		self.data = data

	def read(self):
		return self.data

	def save(self):
		return filestorage.save_data(self.data)
		# f = fs.new_file()
		# f.write(self.data)
		# id = f._id
		# f.close()
		# return str(id)  # str(blob_collection.insert({"data": self.data}))

	@staticmethod
	def find_one(id):
		try:
			data = filestorage.read_file(id)
			blob = Blob(data)
			return blob
		except:
			return None
		#
		# f = fs.get(ObjectId(id))
		# if f:
		# 	blob = Blob(f.read())
		# 	return blob
		# else:
		# 	return None
