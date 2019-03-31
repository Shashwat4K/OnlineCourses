(function () {
    'use strict';
    angular
        .module('app')
        .controller('Home.IndexController', Controller);

    function Controller(UserService) {
        var fac = this;
        fac.user = null;
        initController();

        function initController() {
            UserService.GetCurrent().then(function (user) {
                console.log("Inside initController() of home");
                fac.user = user;
            });
        }
    }
})();