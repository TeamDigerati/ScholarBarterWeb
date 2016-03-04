(function () {

  var injectParams = ['$scope', '$location', '$routeParams',
                      '$timeout', 'config', 'dataService', 'modalService'];

  var UserEditController = function ($scope, $location, $routeParams,
                                         $timeout, config, dataService, modalService) {

    var vm = this,
        customerId = ($routeParams.customerId) ? parseInt($routeParams.customerId) : 0,
        timer,
        onRouteChangeOff;

    vm.customer = {};
    vm.title = 'Add';
    vm.buttonText = 'Add';
    vm.updateStatus = false;
    vm.errorMessage = '';

    vm.firstName = '';
    vm.lastName = '';
    vm.gender = '';
    vm.eduEmail = '';
    vm.passwordHash = '';
    vm.passwordConfirm = '';
    vm.enabled = 1;

    vm.isStateSelected = function (customerStateId, stateId) {
      return customerStateId === stateId;
    };

    vm.saveCustomer = function () {
      if ($scope.editForm.$valid) {
        if (vm.passwordHash == vm.passwordConfirm)
        dataService.addUser(vm.firstName, vm.lastName, vm.gender, vm.eduEmail, vm.passwordHash, vm.enabled).then(processSuccess, processError).then(function (data) {
          processSuccess();
        }, function (error) {
          processError(error);
        });
        else {
          alert('Password does not match!!!');
        }
      }
    };


    function init() {

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

  UserEditController.$inject = injectParams;

  angular.module('usersApp').controller('UserEditController', UserEditController);

}());