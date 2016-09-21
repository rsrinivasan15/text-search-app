/**
 * Service that provides the filtered movie list.
 */
angular.module('myApp').factory('MovieListDataService', [
	'$q',
	'$http',
	'$timeout',
	function($q, $http, $timeout) {
		var getAllMovies = function() {
			var defer = $q.defer();
			$http.get('data/movieList.json').then(function(list) {
				defer.resolve(list.data);
			});
			return defer.promise;
		};

		return {
			/**
			 * Returns a promise that will be get resolved with the filtered movie list
			 * that matches the searchTerm.
			 * @param {String} searchTerm - Search term to match.
			 * @returns {*}
			 */
			getMovieListBySearchTerm: function(searchTerm) {
				var defer = $q.defer();
				if (searchTerm.length === 0) {
					defer.resolve([]);
				}
				getAllMovies().then(function(movieMetaData) {
					var filteredMovies = _.filter(movieMetaData, function(movie) {
						return (movie.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);
					});
					// This is purely to simulate a delay in the response.
					$timeout(function() {
						defer.resolve(filteredMovies);
					}, 1000);

				});
				return defer.promise;
			},
			/**
			 * Returns a promise that will get resolved with all the movies in the database.
			 */
			getAllMovies: getAllMovies
		}
	}
]);