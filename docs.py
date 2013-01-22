from application import app, mongo_conn, mongo
from mongokit import ObjectId

blob_collection = mongo.blobs

class Blob(object):
	def __init__(self, data):
		self.data = data
	def save(self):
		return str(blob_collection.insert({"data": self.data}))

	@staticmethod
	def find_one(id):
		record = blob_collection.find_one({"_id": ObjectId(id)})
		if record:
			blob = Blob(record['data'])
			return blob
		else:
			return None
