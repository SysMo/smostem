'''
Created on Jun 19, 2015

@author: Atanas Pavlov
'''
import json
import datetime
from bson.json_util import SON, string_types, default 
from flask import Response

def _default(obj):
	"""
	Custom conversion of BSON types
	"""
	if isinstance(obj, datetime.datetime):
		return obj.strftime("%Y-%m-%d %H:%M:%S")
	else:
		return default(obj)
	
def _json_convert(obj):
	"""Recursive helper method that converts BSON types so they can be
	converted into json.
	"""
	if hasattr(obj, 'iteritems') or hasattr(obj, 'items'):  # PY3 support
		return SON(((k, _json_convert(v)) for k, v in obj.iteritems()))
	elif hasattr(obj, '__iter__') and not isinstance(obj, string_types):
		return list((_json_convert(v) for v in obj))
	try:
		return _default(obj)
	except TypeError:
		return obj

def jsonResponse(data):
	"""Convert Mongo object(s) to JSON"""
	return Response(json.dumps(_json_convert(data)), content_type='application/json')

# # Register a RESTful API
# def registerAPI(app, view, endpoint, url, pk, pk_type='string'):
# 	"""Utility function to register RESTful API"""
# 	view_func = view.as_view(endpoint)
# 	app.add_url_rule(url, defaults={pk: None},
# 					 view_func=view_func, methods=['GET',])
# 	app.add_url_rule(url, defaults={pk: None},
# 					view_func=view_func, methods=['POST',])
# 	app.add_url_rule('%s/<%s:%s>' % (url, pk_type, pk), view_func=view_func,
# 					 methods=['GET', 'PUT', 'DELETE', 'POST'])

# Send JSON response on errors
# def make_json_error(ex):
# 	response = jsonify(message=str(ex))
# 	response.status_code = (ex.code
# 							if isinstance(ex, HTTPException)
# 							else 500)
# 	return response
# 
# for code in default_exceptions.iterkeys():
# 	app.error_handler_spec[None][code] = make_json_error
