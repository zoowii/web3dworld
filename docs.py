from application import mongo, fs
from mongokit import ObjectId
import base64

blob_collection = mongo.blobs

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
		return str(id) # str(blob_collection.insert({"data": self.data}))

	@staticmethod
	def find_one(id):
		f = fs.get(ObjectId(id))
		if f:
			blob = Blob(f.read())
			return blob
		else:
			return None
#		record = blob_collection.find_one({"_id": ObjectId(id)})
#		if record:
#			blob = Blob(record['data'])
#			return blob
#		else:
#			return None
