﻿(function () {

  var injectParams = ['$http', '$q', '$rootScope', 'authService'];

  var customersFactory = function ($http, $q, $rootScope, authService) {
    var serviceBase = 'http://api.scholarbarter.com:8080/api/dataservice/',
   // var serviceBase = 'http://localhost:58760/api/dataservice/',
          factory = {};

    factory.getlistings = function (pageIndex, pageSize) {
      return getPagedResource('activeListings', pageIndex, pageSize);
    };

    factory.getCustomers = function (pageIndex, pageSize) {
      return getPagedResource('activeUsers', pageIndex, pageSize);
    };

    factory.getCustomersSummary = function (pageIndex, pageSize) {
      return getPagedResource('allUsers', pageIndex, pageSize);
    };

    factory.getStates = function () {
      return $http.get(serviceBase + 'states').then(
          function (results) {
            return results.data;
          });
    };

    factory.getListingTypes = function () {
      return $http.get(serviceBase + 'listingTypes').then(
          function (results) {
            return results.data;
          });
    };

    factory.checkUniqueValue = function (id, property, value) {
      if (!id) id = 0;
      return $http.get(serviceBase + 'checkUnique/' + id + '?property=' + property + '&value=' + escape(value)).then(
          function (results) {
            return results.data.status;
          });
    };

    factory.addListing = function (userId, title, desc, type, quantity, price) {
      //return $http.get(serviceBase + 'addListing/?userId=' + userId + '&title=' + title + '?desc=' + desc + '?type=' + type + '?quantity=' + quantity + '?price=' + price).then(function (results) {
      return $http.post(serviceBase + 'addListing', { userId: userId, listingType: type, title: title, description: desc, price: price, quantity: quantity }).then(function (results) {
        //customer.id = results.data.id;
        return results.data;
      });
    };

    factory.addUser = function (firstName, lastName, gender, eduEmail, passwordHash, enabled) {
      return $http.post(serviceBase + 'addUser', { firstName: firstName, lastName: lastName, gender: gender, eduEmail: eduEmail, passwordHash: passwordHash, enabled: enabled }).then(function (results) {
        $rootScope.currentUser = results.data;
        //Calling login method in AuthService. This is a hack right now.
        //Ideally merge the code from UserService and AuthService into single service
        authService.login(eduEmail, passwordHash);
        return results.data;
      });
    };

    factory.newCustomer = function () {
      return $q.when({ id: 0 });
    };

    factory.updateCustomer = function (customer) {
      return $http.put(serviceBase + 'putCustomer/' + customer.id, customer).then(function (status) {
        return status.data;
      });
    };

    factory.deleteCustomer = function (id) {
      return $http.delete(serviceBase + 'deleteCustomer/' + id).then(function (status) {
        return status.data;
      });
    };

    factory.getCustomer = function (id) {
      //then does not unwrap data so must go through .data property
      //success unwraps data automatically (no need to call .data property)
      return $http.get(serviceBase + 'userById/' + id).then(function (results) {
        extendCustomers([results.data]);
        return results.data;
      });
    };

    function extendCustomers(customers) {
      var custsLen = customers.length;
      //Iterate through customers
      for (var i = 0; i < custsLen; i++) {
        var cust = customers[i];
        if (!cust.orders) continue;

        var ordersLen = cust.orders.length;
        for (var j = 0; j < ordersLen; j++) {
          var order = cust.orders[j];
          order.orderTotal = order.quantity * order.price;
        }
        cust.ordersTotal = ordersTotal(cust);
      }
    }

    function getPagedResource(baseResource, pageIndex, pageSize) {
      var resource = baseResource;
      resource += (arguments.length == 3) ? buildPagingUri(pageIndex, pageSize) : '';
      return $http.get(serviceBase + resource).then(function (response) {
        var custs = response.data;
        extendCustomers(custs);
        return {
          totalRecords: parseInt(response.headers('X-InlineCount')),
          results: custs
        };
      });
    }

    function buildPagingUri(pageIndex, pageSize) {
      var uri = '?$top=' + pageSize + '&$skip=' + (pageIndex * pageSize);
      return uri;
    }

    // is this still used???
    function orderTotal(order) {
      return order.quantity * order.price;
    };

    function ordersTotal(customer) {
      var total = 0;
      var orders = customer.orders;
      var count = orders.length;

      for (var i = 0; i < count; i++) {
        total += orders[i].orderTotal;
      }
      return total;
    };

    return factory;
  };

  customersFactory.$inject = injectParams;

  angular.module('usersApp').factory('usersService', customersFactory);

}());