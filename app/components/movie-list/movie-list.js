angular.module('myApp')

  .component('movieList', {
    templateUrl: 'components/movie-list/movie-list.html',
    controller: 'MovieListController'
  })

  .controller('MovieListController', [
    'MovieListDataService',
    '$element',
    '$timeout',
    function(MovieListDataService, $element, $timeout) {

      this.searchTerm = '';

      this.loadingMovies = false;

      this.selectedMovie = null;

      this.showMovieNames = false;

      this.movieList = [];

      var movieVirtualRepeatElement = $element[0].querySelector('.movie-name-virtual-repeat');
      var movieOverlayElement = $element[0].querySelector('.movie-overlay');
      var transactionId = 0;

      var populateFilteredMovieList = function(id) {
        this.movieList = [];
        this.loadingMovies = true;
        MovieListDataService.getMovieListBySearchTerm(this.searchTerm)
          .then(function(list) {
            if (id === transactionId) {
              this.movieList = list;
            }
          }.bind(this))
          .finally(function() {
            if (id === transactionId) {
              this.loadingMovies = false;
              this.showMovieNames = (this.movieList.length > 0);
              $timeout(function() {
                setMovieNameContainerHeight();
              });
            }
          }.bind(this));
      }.bind(this);

      var setMovieNameContainerHeight = function() {
        var height = this.movieList.length * 20;
        if (height > 200) {
          height = 200;
        }
        movieVirtualRepeatElement.style.height = height + 'px';
      }.bind(this);

      this.onSearchTermChange = _.debounce(function() {
        transactionId++;
        populateFilteredMovieList(transactionId);
      }, 300);

      this.selectMovie = function(movie) {
        this.selectedMovie = movie;
        this.movieList = [movie];
        this.searchTerm = movie.name;
        this.showMovieNames = false;
      };

      movieOverlayElement.addEventListener('click', function() {
        $timeout(function() {
          this.showMovieNames = false;
        }.bind(this));
      }.bind(this));
    }
  ]);