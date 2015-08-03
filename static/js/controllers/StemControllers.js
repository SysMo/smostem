// Page with quantities list
Stem.controller('QuantitiesCtrl', function($scope, StemResources, Menus) {
	$scope.Quantities = new StemResources.StandardResource('Quantities', 'QuantityEditor');
	$scope.Quantities.query();
	Menus.addMenuItem('topbar', 'New', $scope.Quantities.create, 'action', 'glyphicon-plus');
});

//Editor for an individual quantity
Stem.controller('QuantityEditorCtrl', function($scope, PageSettings, StemResources, StemUtil, Menus) {
	// Add a link to the Quantities collection
	Menus.addMenuItem('topbar', 'Quantities', '/Quantities');
	// Fetch the quantity information
	$scope.quantity =  StemResources.Quantities.get({_id: PageSettings.quantityID});
	// Add a new unit
	$scope.addUnit = function(index) {
		$scope.quantity.units.splice(index, 0, ["", {mult:1, offset:0}]);
	};
	// Delete unit
	$scope.deleteUnit = function(index) {
		$scope.quantity.units.splice(index, 1);
	};
	// Save quantity definition
	$scope.save = function() {
		$scope.quantity.$update();
	};
	Menus.addMenuItem('topbar', 'Save', $scope.save, 'action', 'glyphicon-floppy-disk');
});

//Page with model list
Stem.controller('ModelCollectionCtrl', function($scope, PageSettings, StemResources, Menus, UserService){	
	var userIsAdmin = UserService.isAdmin();
	var userIsAuthenticated = UserService.isAuthenticated();
	
	// Load models - "Public models"
	$scope.publicModels = new StemResources.StandardResource('Models', 'ModelEditor');
	$scope.publicModels.query({modelUserRelation: 'public'});
	
	$scope.listedModelsTabs = [
       { title:'Public models', models:$scope.publicModels, active:true }
	];
	
	// Load models - "My models" and "Models shared with me"
	if (userIsAuthenticated) {
		$scope.myModels = new StemResources.StandardResource('Models', 'ModelEditor');
		$scope.myModels.query({modelUserRelation: 'own'});
		
		$scope.sharedModels = new StemResources.StandardResource('Models', 'ModelEditor');
		$scope.sharedModels.query({modelUserRelation: 'shared'});
		
		$scope.listedModelsTabs.push(
			{ title:'My models', models:$scope.myModels, active:true},
			{ title:'Models shared with me', models:$scope.sharedModels, active:false}
		);
		
		$scope.listedModelsTabs[0].active = false; //Public models
		Menus.addMenuItem('topbar', 'New', $scope.myModels.create, 'action', 'glyphicon-plus');
	}
	
	// Load models - "All models"
	if (userIsAdmin) {
		$scope.allModels = new StemResources.StandardResource('Models', 'ModelEditor');
		$scope.allModels.query({modelUserRelation: 'all'});
		
		$scope.listedModelsTabs.push(
			{ title:'All models', models:$scope.allModels, active:false }
		);
	}
});

// Page with model editor
Stem.controller('ModelEditorCtrl', function($scope, 
		PageSettings, StemResources, StemQuantities, StemLibraryModules, Menus){
	
	// Add a link to the Models collection
	Menus.addMenuItem('topbar', 'Models', '/Models');
	// Get the model object from the server
	$scope.model =  StemResources.Models.get({_id: PageSettings.modelID}, function() {
		// Add the selectors for the different board parts
	});
	// Load quantities from server
	$scope.quantitiesLoaded = false;
	StemQuantities.loadQuantities(function(quantities){
		$scope.quantities = quantities;
		$scope.quantitiesLoaded = true;
	});
	// Load library modules from server
	$scope.libraryModulesLoaded = false;
	StemLibraryModules.loadLibraryModules(function(libraryModules){
		$scope.libraryModules = libraryModules;
		$scope.libraryModulesAccordionObj = {};
		angular.forEach($scope.libraryModules, function(lib, key) {
			$scope.libraryModulesAccordionObj[key] = {};
			$scope.libraryModulesAccordionObj[key].importName = lib.importName;
			$scope.libraryModulesAccordionObj[key].functions = [];
			angular.forEach(lib.functions, function(func, index) {
				var signatureString = "";
				signatureString += func.name
				signatureString += "(";
				angular.forEach(func.arguments, function(argument, index) {
					if (index == func.arguments.length - 1) {
						signatureString += argument.name;
					} else {
						signatureString += argument.name + ", ";
					}
				});
				signatureString += ")";
				$scope.libraryModulesAccordionObj[key].functions.push({"signature": signatureString, "description": func.description, "arguments": func.arguments});
			});
		});
		//console.log($scope.libraryModules);
		$scope.libraryModulesLoaded = true;
	});
	// Compute model
	$scope.compute = function() {
		$scope.model.$compute();
	};
	Menus.addMenuItem('topbar', 'Compute', $scope.compute, 'action', 'glyphicon glyphicon-play-circle');
	// Save model
	$scope.save = function() {
		$scope.model.$update();
	};
	Menus.addMenuItem('topbar', 'Save', $scope.save, 'action', 'glyphicon-floppy-disk');
	// Edit basic model properties
	$scope.editProps = function() {
		$("#" + $scope.model._id + "-modal").modal();
	}
	Menus.addMenuItem('topbar', 'Properties', $scope.editProps, 'action', 'glyphicon glyphicon-cog');
});

//Page with library modules
Stem.controller('LibraryModuleCollectionCtrl', function($scope, PageSettings, StemResources, Menus){
	$scope.LibraryModules = new StemResources.StandardResource('LibraryModules', 'LibraryModuleEditor');
	$scope.LibraryModules.query();
	Menus.addMenuItem('topbar', 'New', $scope.LibraryModules.create, 'action', 'glyphicon glyphicon-plus');
});

//Editor for an individual quantity
Stem.controller('LibraryModuleEditorCtrl', function($scope, $timeout, PageSettings, StemResources, StemUtil, Menus) {
	// Add a link to the LibraryModules collection
	Menus.addMenuItem('topbar', 'Modules', '/LibraryModules');
	$scope.module = StemResources.LibraryModules.get({_id: PageSettings.moduleID});
	// Create a new function
	$scope.addFunction = function() {
		$scope.module.functions.push({
			name: '',
			description: '',
			arguments: []
		});
		var index = $scope.module.functions.length - 1;
		console.log($scope.module.functions[index]);
		$timeout(function(){$scope.editFunction(index);});
		//$timeout($scope.editFunction();
		
	};
	Menus.addMenuItem('topbar', 'New function', $scope.addFunction, 'action', 'glyphicon glyphicon-plus');
	
	// Delete function
	$scope.deleteFunction = function(index) {
		$scope.module.functions.splice(index, 1);
	};
	// Edit function
	$scope.editFunction = function(index) {
		$('#function-' + index + '-modal').modal();
	};
	
	// Add function argument
	$scope.addFunctionArgument = function(func, index) {
		func.arguments.splice(index, 0, {
			name: '',
			description: '',
		});
	}
	$scope.deleteFunctionArgument = function(func, index) {
		func.arguments.splice(index, 1);
	}

	// Save module
	$scope.save = function() {
		$scope.module.$update()
	}
	Menus.addMenuItem('topbar', 'Save', $scope.save, 'action', 'glyphicon-floppy-disk');
});

Stem.controller('HeaderCtrl', ['$scope', 'Menus', 'UserService', 'StemResources',
		 function($scope, Menus, UserService, StemResources) {
	// Set top bar menu items
	Menus.addMenuItem('topbar', 'Go To', 'GoTo', 'dropdown');
	Menus.addSubMenuItem('topbar', 'GoTo', 'Models', '/Models');
	Menus.addSubMenuItem('topbar', 'GoTo', 'Quantities', '/Quantities');
	Menus.addSubMenuItem('topbar', 'GoTo', 'Library Modules', '/LibraryModules');

	$scope.isCollapsed = false;
	$scope.menu = Menus.getMenu('topbar');
	
	$scope.toggleCollapsibleMenu = function() {
		$scope.isCollapsed = !$scope.isCollapsed;
	};
	// Collapsing the menu after navigation
	$scope.$on('$stateChangeSuccess', function() {
   			$scope.isCollapsed = false;
   	});
	
	// Login form - show
	$scope.UserService = UserService;
	
	var emailRegExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	$('#LoginModal form').submit(function() {
		var errorFlag = false;
		$('#loginMessage').empty();
		if (!emailRegExp.test($('#loginInputEmail').val())) {
			$('#loginMessage').append("<div>Email address must be valid</div>");
			errorFlag = true;
		}
		if (errorFlag) {
			return;
		}
		StemResources.Users.login({
			id: $('#loginInputEmail').val(), 
			password: $('#loginInputPassword').val()
			}, function () {
				$('#loginInputPassword').val("");
				$('#LoginModal').modal("hide");
				location.reload();
			}, function(response) {
				$('#loginMessage').append("<div>" + response.data.msg + "</div>");
			}
		);			
	});	
}]);

//Register
Stem.controller('RegisterCtrl', function($scope, StemResources){
	$(document).ready(function () {
		var emailRegExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		$('#RegisterForm').submit(
			function() {
				var errorFlag = false;
				$('#registrationMessage').empty();
				if (!emailRegExp.test($('#RegisterForm #inputEmail').val())) {
					$('#registrationMessage').css("color", "red").append("<div>Email address must be valid</div>");
					errorFlag = true;
				}
				if ($('#RegisterForm #inputPassword').val() != $('#RegisterForm #confirmPassword').val()) {
					$('#registrationMessage').css("color", "red").append("<div>Passwords don't match</div>");
					errorFlag = true;
				}
				if (errorFlag) {
					return;
				}
				StemResources.Users.create({
					    username: $('#RegisterForm #inputUserName').val(), 
						email: $('#RegisterForm #inputEmail').val(), 
						firstName: $('#RegisterForm #inputFirstName').val(),
						lastName: $('#RegisterForm #inputLastName').val(),
						country: $('#RegisterForm #inputCountry').val(),
						organization: $('#RegisterForm #inputOrganization').val(),
						password: $('#RegisterForm #inputPassword').val()
					}, 
					function () {
						$('#registrationMessage').css("color", "green")
							.append('<div>You have successfully registered.</div>')
							.append('<div>You will receive an email with a link to confirm your registration.</div>')
							.append('<div style="color: black; margin-top: 5px;">Go to <a href="/Models">Models</a></div>');
					},
					function(response) {
						$('#registrationMessage').css("color", "red").append("<div>" + response.data.msg + "</div>");
					}
				);			
			}
		);
	});
});