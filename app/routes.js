angular.module('myApp')

	.config(['$routeProvider', function($routeProvider) {
		$routeProvider
			.when('/movie-list', {
				template: '<movie-list></movie-list>'
			});
	}]);