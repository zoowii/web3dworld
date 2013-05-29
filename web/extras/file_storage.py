# coding: UTF-8


class FileStorage:
	def __init__(self, app):
		self.app = app

	def set_strategy(self, strategy_cls):
		self.strategy = strategy_cls(self.app)

	def read_file(self, key):
		return self.strategy.read_file(key)

	def save_file(self, file):
		return self.strategy.save_file(file)

	def save_data(self, data):
		return self.strategy.save_data(data)


class FileStorageStrategy:
	def __init__(self, app):
		self.app = app

	def read_file(self, key):
		pass

	def save_file(self, file):
		pass

	def save_data(self, data):
		pass


class MongoStorageStrategy(FileStorageStrategy):
	def read_file(self, key):
		from mongokit import ObjectId

		fs = self.app.services['fs']
		f = fs.get(ObjectId(key))
		data = f.read()
		f.close()
		return data

	def save_file(self, file):
		data = file.read()
		file.close()
		return self.save_data(data)

	def save_data(self, data):
		fs = self.app.services['fs']
		f = fs.new_file()
		f.write(data)
		fid = f._id
		f.close()
		return str(fid)
