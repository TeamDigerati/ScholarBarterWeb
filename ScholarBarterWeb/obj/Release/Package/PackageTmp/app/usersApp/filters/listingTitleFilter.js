(function () {

  var listingTitleFilter = function () {

    function matchesProduct(listing, filterValue) {
      if (listing) {
        if (listing.title.toLowerCase().indexOf(filterValue) > -1) {
          return true;
        }
      }
      return false;
    }

    return function (listings, filterValue) {
      if (!filterValue || !listings) return listings;

      var matches = [];
      filterValue = filterValue.toLowerCase();
      for (var i = 0; i < listings.length; i++) {
        var listing = listings[i];
        if (matchesProduct(listing, filterValue)) {
          matches.push(listing);
        }
      }
      return matches;
    };
  };

  angular.module('usersApp').filter('listingTitleFilter', listingTitleFilter);

}());