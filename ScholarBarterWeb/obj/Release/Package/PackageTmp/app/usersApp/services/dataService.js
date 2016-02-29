(function () {

    var injectParams = ['config', 'usersService'];

    var dataService = function (config, usersService) {
        return usersService;
    };

    dataService.$inject = injectParams;

    angular.module('usersApp').factory('dataService', dataService);

}());

