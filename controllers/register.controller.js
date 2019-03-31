var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('config.json');

router.get('/', function(req, res){
    res.render('register');
});



router.post('/', function(req, res){

    request.post({
        url: config.apiUrl + '/users/register',
        form: req.body,
        json: true
    }, function (error, response, body){
        if(error){
            return res.render('register', { error: 'An error occurred' });
        }
        if(response.statusCode !== 200){
            return res.render('register', {
                error: response.body,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                username: req.body.username,
                Email: req.body.Email,
                UserType: req.body.UserType
            });
        }
        req.session.success = 'Registration Successful';
        return res.redirect('/login');
    });
});

module.exports = router;