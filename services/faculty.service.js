var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, {native_parser: true});
db.bind('faculty');

var service = {};
/*
*   var service = {
*       authenticate : function(username, password){
*
*                       }
*
*                  ...
*   }
* */

service.authenticate = authenticate;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;

function authenticate(username, password) {
    var deferred = Q.defer();
    db.faculty.findOne({fusername: username}, function(err, user) {
        if(err){
            deferred.reject(err.name + ':' + err.message);
        }
        if(user && bcrypt.compareSync(password, user.hash)) {
            deferred.resolve(jwt.sign({sub: user._id}, config.secret));
        }else{
            deferred.resolve();
        }

    });
    return deferred.promise;
}
function getById(_id) {
    var deferred = Q.defer();
    db.faculty.findById(_id, function(err, user) {
        if(err) {
            deferred.reject(err.name + ': ' + err.message);
        }
        if (user) {
            // return user (without hashed password)
            deferred.resolve(_.omit(user, 'hash'));
        } else {
            // user not found
            deferred.resolve();
        }
    });
    return deferred.promise;
}

function create(userParam) {
    var deferred = Q.defer();

    db.faculty.findOne({fusername: userParam.fusername}, function(err, user) {
        if(err) deferred.reject(err.name + ': ' + err.message);
        if(user){
            deferred.reject('Username "' + userParam.fusername + '" is already taken. Try a new one!');
        }else{
            createUser();
        }
    });

    function createUser() {
        var user = _.omit(userParam, 'fpassword');
        user.hash = bcrypt.hashSync(userParam.fpassword, 10);
        db.faculty.insert(
            user,
            function (err, doc) {
                if(err){
                    deferred.reject(err.name + ': ' + err.message);
                }
                deferred.resolve();
            }
        );
    }
    return deferred.promise;
}

function update(_id, userParam) {
    var deferred = Q.defer();

    // validation
    db.faculty.findById(_id, function (err, user) {
        if (err){
            deferred.reject(err.name + ': ' + err.message);
        }

        if (user.fusername !== userParam.fusername) {
            // username has changed so check if the new username is already taken
            db.faculty.findOne(
                { fusername: userParam.fusername },
                function (err, user) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (user) {
                        // username already exists
                        deferred.reject('Username "' + req.body.fusername + '" is already taken! Try a new one!');
                    } else {
                        updateUser();
                    }
                });
        } else {
            updateUser();
        }
    });

    function updateUser() {
        // fields to update
        var set = {
            facultyFirstName: userParam.facultyFirstName,
            facultyLastName: userParam.facultyLastName,
            fusername: userParam.fusername,
            FEmail : userParam.FEmail,
            UserType: userParam.UserType
        };

        // update password if it was entered
        if (userParam.fpassword) {
            set.hash = bcrypt.hashSync(userParam.fpassword, 10);
        }

        db.faculty.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    db.faculty.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}