# coding: UTF-8
from application import app
from flask import render_template, redirect, url_for
import os

@app.route('/')
@app.route('/index')
def index():
	return redirect(url_for('editor'))

#	return 'hi, welcome to web3dhouse!'

@app.route('/editor')
def editor():
	return render_template('editor.html', title=u'3D编辑器')


@app.route('/info')
def info():
	info = os.getenv('VCAP_SERVICES', '{}')
	return info
