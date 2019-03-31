(function(){
    'use strict';
    function Service($http, $q){
        var service = {};

        service.GetCurrent = GetCurrent;
        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetByUsername = GetByUsername;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;

        function handleSuccess(res){
            return res.data;
        }

        function handleError(res){
            return $q.reject(res.data);
        }

        function GetCurrent() {
            return $http.get('/api/faculty/current').then(handleSuccess, handleError);
        }

        function GetAll() {
            return $http.get('/api/faculty').then(handleSuccess, handleError);
        }

        function GetById(_id) {
            return $http.get('/api/users/' + _id).then(handleSuccess, handleError);
        }

        function GetByUsername(username) {
            return $http.get('/api/faculty' + username).then(handleSuccess, handleError);
        }

        function Create(user) {
            return $http.post('/api/faculty', user).then(handleSuccess, handleError);
        }

        function Update(user) {
            return $http.put('/api/faculty/' + user._id, user).then(handleSuccess, handleError);
        }

        function Delete(_id) {
            return $http.delete('/api/faculty/' + _id).then(handleSuccess, handleError);
        }
    }
    angular.module('app').factory('UserService', Service);
})();
