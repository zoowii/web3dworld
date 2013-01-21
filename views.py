from application import app

@app.route('/')
@app.route('/index')
def index():
	return 'hi, flask'

@app.route('/info')
def info():
	print os.environ
	return 'info'
