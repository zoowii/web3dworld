from web.app import application
db = application.services['db']
from datetime import datetime


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True)
    email = db.Column(db.String(80), unique=True)

    def __init__(self, username, email):
        self.username = username
        self.email = email

    def __repr__(self):
        return '<User %r>' % self.username


class Resource(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    blob_key = db.Column(db.String(50), nullable=False)
    tags = db.Column(db.String(50), default='')
    type = db.Column(db.String(10))
    create_time = db.Column(db.DATETIME)
    creator_id = db.Column(db.Integer)

    def __init__(self, name, type, blob_key, tags='', creator_id=0):
        self.name = name
        self.type = type
        self.blob_key = blob_key
        self.tags = tags
        self.create_time = datetime.now()
        self.creator_id = creator_id

    def __repr__(self):
        return '<Resource %r>' % self.name