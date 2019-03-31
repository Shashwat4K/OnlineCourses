var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('config.json');

router.get('/', function(req, res){
    res.render('registerFaculty');
});

router.post('/', function(req, res){
    request.post({
        url: config.apiUrl + '/faculty/register',
        form: req.body,
        json: true
    }, function(error, response, body){
        if(error){
            return res.render('registerFaculty', {error: 'An Error Occured!'});
        }
        if (response.statusCode !== 200){
            return res.render('registerFaculty', {
                error: response.body,
                facultyFirstName: req.body.facultyFirstName,
                facultyLastName: req.body.facultyLastName,
                fusername: req.body.fusername,
                FEmail: req.body.FEmail,
                UserType: req.body.UserType
            });
        }
        req.session.success = 'Registration Successful!';
        return res.redirect('/loginFaculty')
    });
});

module.exports = router;
