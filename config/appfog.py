import json, os
services = json.loads(os.getenv('VCAP_SERVICES', '{}'))
mysql_service = services['mysql-5.1'][0]
mysql_cred = mysql_service['credentials']
db_username = mysql_cred['username']
db_password = mysql_cred['password']
db_host = mysql_cred['host']
db_port = mysql_cred['port']
db_name = mysql_cred['name']
DATABASE_URI = 'mysql://%s:%s@%s:%s/%s' % (
	db_username,
	db_password,
	db_host,
	db_port,
	db_name
)
SQLALCHEMY_DATABASE_URI = DATABASE_URI

