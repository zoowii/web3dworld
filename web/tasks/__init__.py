from framework import Task
from load_task import LoadTask


class AdminViewTask(Task):
	def process(self):
		import admin_view_task