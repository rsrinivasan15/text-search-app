describe('Movie List controller', function() {
  var controller;
  var mockDataService;
  var mockElement;
  var debounceFlush;
  var searchTermDefer;
  beforeEach(module('myApp'));

  beforeEach(inject(function($controller, $q) {
    mockElement = [
      {
        querySelector: function() {
          return {
            addEventListener: jasmine.createSpy('addEventListener')
          }
        }
      }
    ];
    searchTermDefer = $q.defer();
    mockDataService = {
      getAllMovies: jasmine.createSpy('allMovies').and.returnValue($q.defer().promise),
      getMovieListBySearchTerm: jasmine.createSpy('getMoviesBySearchTerm').and.returnValue(searchTermDefer.promise)
    };
    spyOn(_, 'debounce').and.callFake(function(fn) {
      debounceFlush = fn;
      return fn;
    });
    controller = $controller('MovieListController', {
      MovieListDataService: mockDataService,
      $element: mockElement
    });
  }));

  // Testing a public method.
  it('can select a movie', function() {
    var movie = {imageUrl: 'blah', name: 'blah blah'};
    controller.selectMovie(movie);
    expect(controller.selectedMovie).toBe(movie);
    expect(controller.filteredMovieList).toEqual([movie]);
    expect(controller.searchTerm).toBe(movie.name);
    expect(controller.showMovieNames).toBe(false);
  });

  // Testing a private method. Shows how to unit test around the promise.
  it('can populate filtered movie list', inject(function($rootScope) {
    this.searchTerm = 'blah';
    controller.onSearchTermChange();
    expect(controller.loadingMovies).toBe(true);
    var list = [{imageUrl: 'blah.com', name: 'blah blah'}];
    searchTermDefer.resolve(list);
    $rootScope.$digest();
    expect(controller.filteredMovieList).toBe(list);
    expect(controller.loadingMovies).toBe(false);
    expect(controller.showMovieNames).toBe(true);
  }));
});