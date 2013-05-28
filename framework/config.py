class Config:
	def __init__(self, config_filepath):
		self.filepath = config_filepath

	@staticmethod
	def install(application, config):
		application.app.config.from_pyfile(config.filepath)

	@staticmethod
	def default_config():
		return Config.create('../config/default_settings.py')

	@staticmethod
	def create(filepath):
		return Config(filepath)