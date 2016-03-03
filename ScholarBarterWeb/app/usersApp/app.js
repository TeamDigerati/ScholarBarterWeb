(function () {

  var app = angular.module('usersApp',
      ['ngRoute', 'ngAnimate', 'wc.directives', 'ui.bootstrap', 'breeze.angular']);

  app.config(['$routeProvider', function ($routeProvider) {
    var viewBase = '/app/usersApp/views/';

    $routeProvider
        .when('/users', {
          controller: 'UsersController',
          templateUrl: viewBase + 'customers/customers.html',
          controllerAs: 'vm'
        })
        .when('/userlistings/:customerId', {
          controller: 'UserListingsController',
          templateUrl: viewBase + 'customers/userListings.html',
          controllerAs: 'vm'
        })
        .when('/useredit/:customerId', {
          controller: 'UserEditController',
          templateUrl: viewBase + 'customers/userEdit.html',
          controllerAs: 'vm'
        })
        .when('/orders', {
          controller: 'OrdersController',
          templateUrl: viewBase + 'orders/orders.html',
          controllerAs: 'vm'
        })
        .when('/listings', {
          controller: 'ListingsController',
          templateUrl: viewBase + 'listing/listings.html',
          controllerAs: 'vm'
          //,
          //secure: true //This route requires an authenticated user
        })
       .when('/listingAdd', {
         controller: 'listingEditController',
         templateUrl: viewBase + 'listing/ListingAdd.html',
         controllerAs: 'vm'
         //,
         //secure: true //This route requires an authenticated user
       })
        .when('/about', {
          controller: 'AboutController',
          templateUrl: viewBase + 'about.html',
          controllerAs: 'vm'
        })
        .when('/login/:redirect*?', {
          controller: 'LoginController',
          templateUrl: viewBase + 'login.html',
          controllerAs: 'vm'
        })
        .otherwise({ redirectTo: '/listings' });

  }]);

  app.run(['$rootScope', '$location', 'authService',
      function ($rootScope, $location, authService) {

        //Client-side security. Server-side framework MUST add it's 
        //own security as well since client-based security is easily hacked
        $rootScope.$on("$routeChangeStart", function (event, next, current) {
          if (next && next.$$route && next.$$route.secure) {
            if (!authService.user.isAuthenticated) {
              $rootScope.$evalAsync(function () {
                authService.redirectToLogin();
              });
            }
          }
        });

      }]);

}());

