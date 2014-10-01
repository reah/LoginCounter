'use strict';

var express = require('express');
var controller = require('./user.controller');

var router = express.Router();

// simple logger for this router's requests
// all requests to this router will first hit this middleware
router.use(function(req, res, next) {
  console.log('%s %s %s', req.method, req.url, req.path);
  next();
});

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

router.get('/', controller.index);
router.post('/add', controller.add);
router.post('/login', controller.login);
router.post('/resetFixture', controller.clearDB);
router.post('/unitTests', controller.unitTests);

module.exports = router;

