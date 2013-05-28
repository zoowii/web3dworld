import os, sys
def listDirRec(dirPath):
	files = []
	for name in os.listdir(dirPath):
		path = os.path.join(dirPath, name)
		if os.path.isfile(path):
			files.append(path)
		elif os.path.isdir(path):
			map(files.append, listDirRec(path))
		else:
			raise Exception('unknown type of file: %s' % path)
	return files

def endsWithOneInArray(str, ends):
	for end in ends:
		l = len(end)
		if str[-l:] == end:
			return True
	return False