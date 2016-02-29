﻿(function () {

    var injectParams = ['$scope','$routeParams', '$window', 'dataService'];

    var UserListingsController = function ($scope, $routeParams, $window, dataService) {
        var vm = this,
            customerId = ($routeParams.customerId) ? parseInt($routeParams.customerId) : 0;

        vm.customer = {};
        vm.ordersTotal = 0.00;

        init();

        function init() {
            if (customerId > 0) {
                dataService.getCustomer(customerId)
                .then(function (customer) {
                    vm.customer = customer;
                    $scope.$broadcast('customer', customer);
                }, function (error) {
                    $window.alert("Sorry, an error occurred: " + error.message);
                });
            }
        }
    };

    UserListingsController.$inject = injectParams;

    angular.module('usersApp').controller('UserListingsController', UserListingsController);

}());