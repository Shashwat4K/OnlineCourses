(function () {
    'use strict';

    angular.module('app').controller('Account.IndexController', Controller);

    function Controller($window, UserService, FlashService) {
        var my = this;

        my.user = null;
        my.saveUser = saveUser;
        my.deleteUser = deleteUser;

        initController();

        function initController() {
            // get current user
            UserService.GetCurrent().then(function (user) {
                console.log("Inside initController()\n");
                my.user = user;
            });
        }

        function saveUser() {
            UserService.Update(my.user)
                .then(function () {
                    FlashService.Success('User updated');
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }

        function deleteUser() {
            UserService.Delete(my.user._id)
                .then(function () {
                    // log user out
                    $window.location = '/login';
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }
    }

})();