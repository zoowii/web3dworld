from application import app

@app.route('/')
@app.route('/index')
def index():
	return 'hi, flask'