(function () {

  var listingTitleFilter = function () {

    function matchesProduct(listing, filterValue) {
      if (listing) {
        if (listing.listing.title.toLowerCase().indexOf(filterValue) > -1) {
          return true;
        }
      }
      return false;
    }

    function matchesProductByType(listing, filterValue) {
      if (listing) {
        if (listing.listing.listingType.toLowerCase().indexOf(filterValue) > -1) {
          return true;
        }
      }
      return false;
    }

    return function (listings, filterValue, byType) {
      if (!filterValue || !listings) return listings;
      var matches = [];
      filterValue = filterValue.toLowerCase();
      for (var i = 0; i < listings.length; i++) {
        var listing = listings[i];
        if (!byType) {
          if (matchesProduct(listing, filterValue)) {
            matches.push(listing);
          }
        } else {
          if (matchesProductByType(listing, filterValue)) {
            matches.push(listing);
          }
        }
      }
      return matches;
    };
  };

  angular.module('usersApp').filter('listingTitleFilter', listingTitleFilter);

}());