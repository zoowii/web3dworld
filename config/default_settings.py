DEBUG = True
DATABASE_URI = 'sqlite:////tmp/test.db'
SQLALCHEMY_DATABASE_URI = DATABASE_URI

ALLOWED_EXTENSIONS = ['txt', 'css', 'json', 'jpg', 'bmp', 'jpeg', 'png']

import os, sys
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'upload')