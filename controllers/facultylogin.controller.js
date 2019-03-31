var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('config.json');

router.get('/', function(req, res) {
    delete req.session.token;
    var viewData = { success: req.session.success };
    delete req.session.success;
    res.render('loginFaculty', viewData);
});

router.post('/', function(req, res){
    request.post({
        url: config.apiUrl + '/faculty/authenticate',
        form: req.body,
        json: true
    }, function(error, response, body){
        if(error){
            return res.render('loginFaculty', {error: 'An error occured!'});
        }
        if(!body.token){
            return res.render('loginFaculty', { error:body, fusername: req.body.fusername});
        }
        req.session.token = body.token;
        var returnUrl = req.query.returnUrl && decodeURIComponent(req.query.returnUrl) || '/';
        res.redirect(returnUrl);
    });
});
module.exports = router;