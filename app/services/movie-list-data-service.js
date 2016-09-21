angular.module('myApp').factory('MovieListDataService', [
	'$q',
	'$http',
	'$timeout',
	function($q, $http, $timeout) {

		return {
			getMovieListBySearchTerm: function(searchTerm) {
				var defer = $q.defer();
				if (searchTerm.length === 0) {
					defer.resolve([]);
				}
				$http.get('data/movieList.json').then(function(list) {
					var movieMetaData = list.data;
					var filteredMovies = _.filter(movieMetaData, function(movie) {
						return (movie.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);
					});
					// This is purely to simulate a delay in the response.
					$timeout(function() {
						defer.resolve(filteredMovies);
					}, 1000);

				});
				return defer.promise;
			}
		}
	}
]);