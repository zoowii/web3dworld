from framework import Router
from handlers import *


class AppRouter(Router):
	def routes(self):
		return {
		'/': {"methods": ['GET'], "params": [], "handler": HomeHandler, "name": "index"},
		'/editor/': {'methods': ['GET'], 'params': [], 'handler': EditorHandler, 'name': 'editor'},
		'/editor/<path>': {'methods': ['GET'], 'params': ['path'], 'handler': SceneEditorHandler,
		                   'name': 'scene_editor'},
		'/play/': {'methods': ['GET'], 'params': [], 'handler': DefaultPlayerHandler, 'name': 'default_player'},
		'/play/path=<path>': {'methods': ['GET'], 'params': [], 'handler': PlayerHandler, 'name': 'player'},
		'/admin/': {'methods': ['GET'], 'params': [], 'handler': AdminHomeHandler, 'name': 'resource.index'},
		'/admin/resource/json/list/type/<type_name>': {'methods': ['GET'], 'params': ['type_name'],
		                                               'handler': AdminJsonListTypeHandler,
		                                               'name': 'resource.json_list_type'},
		'/admin/json/list/': {'methods': ['GET'], 'params': [], 'handler': AdminJsonListHandler,
		                      'name': 'resource.json_list'},
		'/admin/upload/': {'methods': ['GET', 'POST'], 'params': [], 'handler': ResourceUploadHandler,
		                   'name': 'resource.upload'},
		'/admin/resource/get_by_name/<resource_name>': {'methods': ['GET'], 'params': ['resource_name'],
		                                                'handler': ResourceQueryHandler,
		                                                'name': 'resource.get_by_name'},
		'/admin/converter/obj': {'methods': ['GET', 'POST'], 'params': [], 'handler': ConverterHandler,
		                         'name': 'resource.convert_obj'},
		'/editor/scene/store': {'methods': ['POST'], 'params': [], 'handler': StoreSceneHandler,
		                        'name': 'store_scene_json'}
		}