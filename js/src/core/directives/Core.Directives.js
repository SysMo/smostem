Stem.directive('stemListItemActions', function() {
	return {
		scope: {
			resize: "&resize",
			add: "&add",
			del: "&del",
			edit: "&edit",
			paste: "&paste",
			duplicate: "&duplicate",
			moveUp: "&moveUp",
			moveDown: "&moveDown",
		},
		templateUrl: "stem-list-item-actions.html",
		controller: ['$scope', '$timeout', function($scope, $timeout) {
			$scope.deleteItem = function() {
				$timeout(function(){
					var answer = confirm("Proceed with deletion?");
					if (answer === true) {
					    $scope.del();
					}
				});
			};
		}],
		link: function(scope, element, attributes) {
			if (!("add" in attributes)) {
				scope.add = false;
			}
			if (!("edit" in attributes)) {
				scope.edit = false;
			}
			if (!("paste" in attributes)) {
				scope.paste = false;
			}
			if (!("duplicate" in attributes)) {
				scope.duplicate = false;
			}
			if (!("moveUp" in attributes)) {
				scope.moveUp = false;
			}
			if (!("moveDown" in attributes)) {
				scope.moveDown = false;
			}
			if (!("del" in attributes)) {
				scope.del = false;
			}
			if (!("resize" in attributes)) {
				scope.resize = false;
			}
		}
	};
});

Stem.directive('stemInputNumerical', [function() {
	return {
		scope: {
			numValue:'=stemInputNumerical'
		},
		restrict: 'A',
		templateUrl: "stem-input-numerical.html",
		controller: ['$scope', 'StemUtil', function($scope, StemUtil) {
			$scope.updateDisplay = function() {
				$scope.displayValue = StemUtil.formatNumber($scope.numValue);
			};
			$scope.onInputChange = function() {
				var numValue = parseFloat($scope.displayValue);
				if (!isNaN(numValue)) {
					$scope.numValue = numValue;
				}
			};
			$scope.updateDisplay();
		}],
		link: function(scope, element, attributes) {
		}
	};
}]);