angular.module('myApp')

/**
 * Component that manages the movie list and the search box.
 */
  .component('movieList', {
    templateUrl: 'components/movie-list/movie-list.html',
    controller: 'MovieListController'
  })

  .controller('MovieListController', [
    'MovieListDataService',
    '$element',
    '$timeout',
    function(MovieListDataService, $element, $timeout) {
      // Keeps track of the search term.
      this.searchTerm = '';

      // Indicates if the server call is in progress.
      this.loadingMovies = false;

      // Keeps track of the currently selected movie.
      this.selectedMovie = null;

      // Indicates whether the movie names container should be shown
      // below the search input.
      this.showMovieNames = false;

      // Holds the filtered movie list.
      this.filteredMovieList = [];

      // Holds all the movies. When there is no search term, the thumb nails
      // displays data from this list.
      this.allMovies = [];

      // Cache the element handle at the controller level.
      var movieVirtualRepeatElement = $element[0].querySelector('.movie-name-virtual-repeat');
      var movieOverlayElement = $element[0].querySelector('.movie-overlay');

      // This is used to resolve only the latest response when multiple server call is in progress
      // as a result of user searching frequently and the responses come back in an unordered fashion.
      var transactionId = 0;

      /**
       * Populates the filtered movie list by calling the data service.
       * Since it makes a call to the server this function is debounced by
       * 300ms and we want to wait at least 300ms after the user had stopped typing
       * for us to make those taxing server calls.
       */
      var populateFilteredMovieList = _.debounce(function(id) {
        // Reset the view model variables.
        this.filteredMovieList = [];
        this.loadingMovies = true;
        MovieListDataService.getMovieListBySearchTerm(this.searchTerm)
          .then(function(list) {
            // Resolve the response only if the response is from the latest call.
            // Ignore other responses.
            if (id === transactionId) {
              this.filteredMovieList = list;
            }
          }.bind(this))
          .finally(function() {
            if (id === transactionId) {
              // Set the loading state to false.
              this.loadingMovies = false;
              // Show the movie names container below the search input only if there
              // are suggestions.
              this.showMovieNames = (this.filteredMovieList.length > 0);
              $timeout(function() {
                // Set the height of the container depending on no of movies in the suggestion. This has to be
                // done in the javascript since the md-virtual-repeat container which lazy loads the item needs a
                // fixed height to be set for it to work. Hence we dynamically set the height depending on how
                // many movies to be shown so that the container will neither be too high nor too low.
                setMovieNameContainerHeight();
              });
            }
          }.bind(this));
      }.bind(this), 300);

      /**
       * Sets the height of the movie name container depending on the movie count.
       * @type {function(this:*)}
       */
      var setMovieNameContainerHeight = function() {
        var height = this.filteredMovieList.length * 20;
        if (height > 200) {
          height = 200;
        }
        movieVirtualRepeatElement.style.height = height + 'px';
      }.bind(this);

      /**
       * Callback that will be called when the user searches for a movie.
       */
      this.onSearchTermChange = function() {
        transactionId++;
        this.loadingMovies = true;
        populateFilteredMovieList(transactionId);
      };

      /**
       * Callback that will be called when the user selects a movie from the suggestions.
       * @param movie
       */
      this.selectMovie = function(movie) {
        this.selectedMovie = movie;
        this.filteredMovieList = [movie];
        this.searchTerm = movie.name;
        this.showMovieNames = false;
      };

      /**
       * We create an overlay element to receive the clicks that are made outside the movie suggestion box,
       * that way the movie suggestion can be closed when clicked outside. We show this element in the dom
       * only if the movie suggestion container is opended.
       */
      movieOverlayElement.addEventListener('click', function() {
        // Since we use addEventListener and go outside of angular context, we need a timeout
        // to manually trigger a digest cycle. Otherwise the below update will not be reflected in the UI
        // until the next digest cycle.
        $timeout(function() {
          this.showMovieNames = false;
        }.bind(this));
      }.bind(this));

      // Get all the movies to be displayed if there are no search term.
      MovieListDataService.getAllMovies().then(function(list) {
        this.allMovies = list;
      }.bind(this));
    }
  ]);