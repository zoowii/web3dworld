DEBUG = True
# DATABASE_URI = 'mysql://root:123456@localhost:3306/threejs'
DATABASE_URI = 'sqlite:///./development.db'
SQLALCHEMY_DATABASE_URI = DATABASE_URI

ALLOWED_EXTENSIONS = ['txt', 'css', 'json', 'jpg', 'bmp', 'jpeg', 'png']

MONGODB_HOST = 'localhost'
MONGODB_PORT = 27017
MONGODB_NAME = 'web3dhouse'
MONGODB_USERNAME = 'admin'
MONGODB_PASSWORD = 'admin'