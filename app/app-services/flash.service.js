(function(){
    'use strict';
    angular.module('app').factory('FlashService', Service);
    function Service($rootscope) {

        var service = {};
        service.Success = Success;
        service.Error = Error;

        initService();
        return service;

        function initService(){
            $rootscope.$on('$locationChangeStart', function() {
                clearFlashMessage();
            });
            function clearFlashMessage() {
                const flash = $rootscope.flash;
                if (flash) {
                    if (!flash.keepAfterLocationChange) {
                        delete $rootscope.flash;
                    } else {
                        flash.keepAfterLocationChange = false;
                    }
                }
            }
        }
        function Success(message, keepAfterLocationChange){
            $rootscope.flash = {
                message: message,
                type: 'success',
                keepAfterLocationChange: keepAfterLocationChange
            };
        }
        function Error(message, keepAfterLocationChange) {
            $rootscope.flash = {
                message: message,
                type: 'danger',
                keepAfterLocationChange: keepAfterLocationChange
            };
        }
    }
})();