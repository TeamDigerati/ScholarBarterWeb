(function () {

  var injectParams = ['$http', '$rootScope'];

  var authFactory = function ($http, $rootScope) {
    var serviceBase = 'http://api.scholarbarter.com:8080/api/dataservice/',
    //var serviceBase = 'http://localhost:58760/api/dataservice/',
        factory = {
          loginPath: '/login',
          user: {
            isAuthenticated: false,
            roles: null
          }
        };

    factory.login = function (email, password) {
      //return $http.post(serviceBase + 'login', { userName: email, password: password }, { headers: { 'Content-Type': 'application/json' } }).then(
        return $http.post(serviceBase + 'login', { userName: email, password: password }).then(
          function (results) {
            if (results.data) {
              $rootScope.currentUser = results.data;
              changeAuth(true);
              return true;
            } else {
              return false;
            }
            /*
              var loggedIn = results.data.status;
              changeAuth(loggedIn);
              return loggedIn;
              */
          });
    };

    factory.logout = function () {
      return $http.post(serviceBase + 'logout').then(
          function (results) {
            $rootScope.currentUser = null;
            var loggedIn = !results.data.status;
            changeAuth(loggedIn);
            return loggedIn;
          });
    };

    factory.redirectToLogin = function () {
      $rootScope.$broadcast('redirectToLogin', null);
    };

    function changeAuth(loggedIn) {
      factory.user.isAuthenticated = loggedIn;
      $rootScope.$broadcast('loginStatusChanged', loggedIn);
    }

    return factory;
  };

  authFactory.$inject = injectParams;

  angular.module('usersApp').factory('authService', authFactory);

}());

