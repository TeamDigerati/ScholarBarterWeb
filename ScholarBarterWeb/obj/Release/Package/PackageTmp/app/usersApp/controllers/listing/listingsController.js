(function () {

  var injectParams = ['$location', '$filter', '$window', 'dataService'];

  var ListingsController = function ($location, $filter, $window, dataService) {
    var vm = this;


    vm.listings = [];
    vm.filteredListings;
    vm.filteredCount;

    vm.orderby = 'title';
    vm.reverse = false;

    //paging
    vm.totalRecords = 0;
    vm.pageSize = 10;
    vm.currentPage = 1;

    init();

    vm.setOrder = function (orderby) {
      if (orderby === vm.orderby) {
        vm.reverse = !vm.reverse;
      }
      vm.orderby = orderby;
    };

    vm.pageChanged = function (page) {
      vm.currentPage = page;
      getListings();
    };

    vm.searchTextChanged = function () {
      filterListings(vm.searchText);
    };
    vm.navigate = function (url) {
      $location.path(url);
    };

    function init() {
      getListings();
    }


    function filterListings(filterText) {
      vm.filteredListings = $filter("listingTitleFilter")(vm.listings, filterText);
      vm.filteredCount = vm.filteredListings.length;
    }


    function getListings() {
      dataService.getlistings(vm.currentPage - 1, vm.pageSize)
          .then(function (data) {
            vm.totalRecords = data.totalRecords;
            vm.listings = data.results;
            filterListings('');
          }, function (error) {
            $window.alert(error.message);
          });
    }
  };

  ListingsController.$inject = injectParams;

  angular.module('usersApp').controller('ListingsController', ListingsController);

}());



