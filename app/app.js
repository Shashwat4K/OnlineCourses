(function () {
    'use strict';
    angular
        .module('app', ['ui.router'])
        .config(config)
        .run(run);
    function config($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/");
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl : 'home/index.html',
                controller: 'Home.IndexController',
                controllerAs: 'my',
                date: {activeTab: 'home'}
            })
            .state('account', {
                url: '/account',
                templateUrl: 'account/index.html',
                controller: 'Account.IndexController',
                controllerAs: 'my',
                data: {activeTab: 'account'}
            })
            .state('account', {
                url: '/facultyHome',
                templateUrl: 'facultyHome/index.html',
                controller: 'Home.IndexController',
                controllerAs: 'fac',
                data: {activeTab: 'home'}
            });
    }

    function run($http, $rootScope, $window) {
        // add JWT token as default auth header
        $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.jwtToken;
        // update active tab on state change
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            $rootScope.activeTab = toState.data.activeTab;
        });
    }
    // manually bootstrap angular after the JWT token is retrieved from the server
    $(function (){
        // get JWT token from server
        $.get('/app/token', function (token){
            window.jwtToken = token;

            angular.bootstrap(document, ['app']);
        });
    });

})();