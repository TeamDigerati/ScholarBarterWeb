(function () {

    var injectParams = ['$filter', '$window', 'dataService'];

    var OrdersController = function ($filter, $window, dataService) {
        var vm = this;

        vm.customers = [];
        vm.filteredCustomers;
        vm.filteredCount;

        //paging
        vm.totalRecords = 0;
        vm.pageSize = 10;
        vm.currentPage = 1;

        init();

        vm.pageChanged = function (page) {
            vm.currentPage = page;
            getCustomers();
        };

        vm.searchTextChanged = function () {
            filterCustomersProducts(vm.searchText);
        };

        function init() {
            getCustomers();
        }

        function filterCustomersProducts(filterText) {
            vm.filteredCustomers = $filter("nameProductFilter")(vm.customers, filterText);
            vm.filteredCount = vm.filteredCustomers.length;
        }

        function getCustomers() {
            dataService.getCustomers(vm.currentPage - 1, vm.pageSize)
                .then(function (data) {
                    vm.totalRecords = data.totalRecords;
                    vm.customers = data.results;
                    filterCustomersProducts('');
                }, function (error) {
                    $window.alert(error.message);
                });
        }
    };

    OrdersController.$inject = injectParams;

    angular.module('usersApp').controller('OrdersController', OrdersController);

}());



