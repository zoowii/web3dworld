# coding: UTF-8
from application import app
from flask import render_template, redirect, url_for
import os


@app.route('/')
@app.route('/index/')
def index():
    return player('/static/resources/scenes/test2.json')

#	return 'hi, welcome to web3dhouse!'

@app.route('/editor/')
def editor():
    return render_template('editor.html', title=u'3D编辑器')

@app.route('/play/')
def default_player():
    return player('/static/resources/scenes/default.json')

@app.route('/play/path=<path>')
def player(path):
    return render_template('player.html', path=path, title=u'3D展示页面')


@app.route('/info')
def info():
    info = os.getenv('VCAP_SERVICES', '{}')
    return info
