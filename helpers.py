from application import app
from flask import render_template
import time


def flatten(l):
	for el in l:
		if hasattr(el, "__iter__") and not isinstance(el, basestring):
			for sub in flatten(el):
				yield sub
		else:
			yield el


def parse_options_header(header):
	headers = map(lambda s: s.strip(), header.split(';'))

	def split_quotes(s):
		if len(s) < 2:
			return s
		if s[0] == s[-1] == '"' or s[0] == s[-1] == '\'':
			return s[1:-2]
		else:
			return s

	def parse_header(s):
		if '=' in s:
			tmp1 = [split_quotes(x) for x in s.split('=')]
			if len(tmp1) < 2:
				return {tmp1: tmp1}
			else:
				return {tmp1[0]: s[len(tmp1[0]) + 2:-1]}
		elif ':' in s:
			tmp1 = [split_quotes(x) for x in s.split(':')]
			if len(tmp1) < 2:
				return {tmp1: tmp1}
			else:
				return {tmp1[0]: s[len(tmp1[0]) + 1]}
		else:
			return {s: s}

	headers = [parse_header(x) for x in headers]
	return headers


def allowed_file(filename):
	return '.' in filename and filename.rsplit('.', 1)[1] in app.config['ALLOWED_EXTENSIONS']


def datetimeformat(value, format='%H:%M / %d-%m-%Y'):
	return time.strftime(format, time.localtime(value))

env = app.jinja_env
env.filters['datetimeformat'] = datetimeformat
