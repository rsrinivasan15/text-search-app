describe('MovieListDataService', function() {
	var service;
	var movieList;
	beforeEach(module('myApp'));
	beforeEach(inject(function(MovieListDataService, $httpBackend) {
		service = MovieListDataService;
		movieList = [
			{imageUrl: 'blah', name: 'narcos'},
			{imageUrl: 'blah', name: 'nar'},
			{imageUrl: 'blah', name: 'prison break'},
			{imageUrl: 'blah', name: 'friends'}
		];
		$httpBackend.expectGET('data/movieList.json').respond(movieList);
	}));

	// Test demonstrating http back end mocks and flushing time outs.
	it('can filter movies by the search term', inject(function($rootScope, $timeout, $httpBackend) {
		var filteredList = [];
		service.getMovieListBySearchTerm('nar').then(function(list) {
			filteredList = list;
		});
		$httpBackend.flush();
		$timeout.flush();
		$rootScope.$digest();
		expect(filteredList).toEqual([
			{imageUrl: 'blah', name: 'narcos'},
			{imageUrl: 'blah', name: 'nar'}
		]);
	}));
});