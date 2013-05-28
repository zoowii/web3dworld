class Plugin:
	app = None
	services = {}

	def set_application(self, application):
		self.app = application

	def process(self):
		pass

	def before_process(self):
		pass

	def after_process(self):
		pass

	def get_service(self):
		return self.services

	@staticmethod
	def install(application, plugin):
		plugin.set_application(application)
		plugin.before_process()
		plugin.process()
		services = plugin.get_service()
		application.services.update(services)
		plugin.after_process()