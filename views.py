from application import app
from flask import render_template, redirect
import os

@app.route('/')
@app.route('/index')
def index():
	return redirect('/admin')
#	return 'hi, welcome to web3dhouse!'

@app.route('/editor')
def editor():
	return render_template('editor.html')

@app.route('/info')
def info():
	info = os.getenv('VCAP_SERVICES', '{}')
	return info
