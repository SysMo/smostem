import json
import sys, traceback
from flask import Flask, Response
from flask import render_template
from flask.json import jsonify
from flask.ext.login import LoginManager

from werkzeug.exceptions import default_exceptions
from werkzeug.exceptions import HTTPException

# REST-ful flask extension
from flask_restful import Api

from mongokit import Connection
from pystem.resources.Models import Model, ModelAPI 
from pystem.resources.Quantities import Quantity, QuantityAPI
from pystem.resources.LibraryModules import LibraryModule, LibraryModuleAPI 
from pystem.resources.Users import User 
from pystem.Exceptions import APIException, NonAPIException

app = Flask(__name__)
app.config.from_object('Settings')
app.debug = True
api = Api(app)
mongoConnection = Connection()
loginManager = LoginManager(app)

@loginManager.user_loader
def loadUser(userID):
	return mongoConnection[app.config['STEM_DATABASE']].User.one(userID)

# Pages
@app.route("/")
def index():
	return render_template('StemBase.html')

@app.route("/login")
def login():
	pass

@app.route("/Models")
def listModels():
	return render_template('Models.html')

@app.route("/ModelEditor/<modelID>")
def modelEditor(modelID):
	return render_template('ModelEditor.html', modelID = modelID)

@app.route("/Quantities")
def listQuantities():
	return render_template('Quantities.html')

@app.route("/QuantityEditor/<quantityID>")
def quantityEditor(quantityID):
	return render_template('QuantityEditor.html', quantityID = quantityID)
	

@app.route("/LibraryModules")
def listLibraryModules():
	return render_template('LibraryModules.html')

@app.route("/LibraryModuleEditor/<moduleID>")
def libraryModuleEditor(moduleID):
	return render_template('LibraryModuleEditor.html', moduleID = moduleID)

api.add_resource(ModelAPI, '/stem/api/Models', '/stem/api/Models/<string:modelID>', 
		resource_class_kwargs = {'conn':mongoConnection[app.config['STEM_DATABASE']]})
api.add_resource(QuantityAPI, '/stem/api/Quantities', '/stem/api/Quantities/<string:quantityID>', 
		resource_class_kwargs = {'conn':mongoConnection[app.config['STEM_DATABASE']]})
api.add_resource(LibraryModuleAPI, '/stem/api/LibraryModules', '/stem/api/LibraryModules/<string:moduleID>', 
		resource_class_kwargs = {'conn':mongoConnection[app.config['STEM_DATABASE']]})
mongoConnection.register([Quantity, Model, LibraryModule])

#Exception handling
@app.errorhandler(APIException)
def handleAPIException(error):
	errorInfo = {
		'msg': str(error),
		'type': 'APIException',
		'excType': sys.exc_info()[0].__name__
	}
	response = jsonify(errorInfo)
	response.status_code = error.status_code
	return response

@app.errorhandler(NonAPIException)
def handleNonAPIException(error):
	errorInfo = {
		'msg': str(error),
		'type': 'Exception',
		'excType': error.excType,
		'traceback': error.traceback
	}
	response = jsonify(errorInfo)
	response.status_code = error.status_code
	return response

if __name__ == "__main__":
	app.run()
