(function () {

  var injectParams = ['$scope', '$rootScope', '$location', '$routeParams',
                      '$timeout', 'config', 'dataService', 'modalService'];

  var listingEditController = function ($scope, $rootScope, $location, $routeParams,
                                         $timeout, config, dataService, modalService) {

    var vm = this,
        customerId = 0,//($routeParams.customerId) ? parseInt($routeParams.customerId) : 0,
        timer,
        onRouteChangeOff;

    vm.customer = $rootScope.currentUser;
    vm.listingTypes = [];
    vm.listingTitle = '';
    vm.listingDesc = '';
    vm.listingType = '';
    vm.listingQuantity = '';
    vm.listingPrice = '';
    vm.title = 'Add';//(customerId > 0) ? 'Edit' : 'Add';
    vm.buttonText = 'Add';//(customerId > 0) ? 'Update' : 'Add';
    vm.updateStatus = false;
    vm.errorMessage = '';

    vm.isStateSelected = function (customerStateId, stateId) {
      return customerStateId === stateId;
    };

    vm.addListing = function () {
      if ($scope.editForm.$valid) {
        dataService.addListing(vm.customer.userId, vm.listingTitle, vm.listingDesc, vm.listingType, vm.listingQuantity, vm.listingPrice).then(processSuccess, processError);
      }
    };

    function init() {

      getListingTypes().then(function () {
        if (vm.listingTypes) {
          vm.listingType = vm.listingTypes[0].type;
        }
      });
      
      //Make sure they're warned if they made a change but didn't save it
      //Call to $on returns a "deregistration" function that can be called to
      //remove the listener (see routeChange() for an example of using it)
      onRouteChangeOff = $scope.$on('$locationChangeStart', routeChange);
    }

    init();

    function routeChange(event, newUrl, oldUrl) {
      //Navigate to newUrl if the form isn't dirty
      if (!vm.editForm || !vm.editForm.$dirty) return;

      var modalOptions = {
        closeButtonText: 'Cancel',
        actionButtonText: 'Ignore Changes',
        headerText: 'Unsaved Changes',
        bodyText: 'You have unsaved changes. Leave the page?'
      };

      modalService.showModal({}, modalOptions).then(function (result) {
        if (result === 'ok') {
          onRouteChangeOff(); //Stop listening for location changes
          $location.path($location.url(newUrl).hash()); //Go to page they're interested in
        }
      });

      //prevent navigation by default since we'll handle it
      //once the user selects a dialog option
      event.preventDefault();
      return;
    }


    function getListingTypes() {
      return dataService.getListingTypes().then(function (listingTypes) {
        vm.listingTypes = listingTypes;
      }, processError);
    }

    function processSuccess() {
      $scope.editForm.$dirty = false;
      vm.updateStatus = true;
      vm.title = 'Edit';
      vm.buttonText = 'Update';
      startTimer();
    }

    function processError(error) {
      vm.errorMessage = error.message;
      startTimer();
    }

    function startTimer() {
      timer = $timeout(function () {
        $timeout.cancel(timer);
        vm.errorMessage = '';
        vm.updateStatus = false;
      }, 3000);
    }
  };

  listingEditController.$inject = injectParams;

  angular.module('usersApp').controller('listingEditController', listingEditController);

}());