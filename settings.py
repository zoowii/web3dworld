class Config(object):
	DEBUG = False
	TESTING = False
	DATABASE_URI = 'sqlite://:memory:'
	SQLALCHEMY_DATABASE_URI = DATABASE_URI

class ProductionConfig(Config):
	DATABASE_URI = 'mysql://user:password@localhost/foo'
	SQLALCHEMY_DATABASE_URI = DATABASE_URI

class DevelopmentConfig(Config):
	DEBUG = True
	DATABASE_URI = 'mysql://root@localhost/threejs?charset=utf8&autoReconnect=true'
	SQLALCHEMY_DATABASE_URI = DATABASE_URI

class TestingConfig(Config):
	TESTING = True