'use strict';

var _ = require('lodash');
var exec = require('exec');
var User = require('./user.model');
var NUM_TESTS = 12;


// // Get list of users
exports.index = function(req, res) {
  console.log('INDEX in controller');
  User.find(function (err, users) {
    if(err) { return handleError(res, err); }
    return res.json(200, users);
  });
};

// Get a single user
exports.show = function(req, res) {
  User.findById(req.params.id, function (err, user) {
    if(err) { return handleError(res, err); }
    if(!user) { return res.send(404); }
    return res.json(user);
  });
};

// Creates a new user in the DB.
exports.create = function(req, res) {
  User.create(req.body, function(err, user) {
    if(err) { return handleError(res, err); }
    return res.json(201, user);
  });
};

// Updates an existing user in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  User.findById(req.params.id, function (err, user) {
    if (err) { return handleError(res, err); }
    if(!user) { return res.send(404); }
    var updated = _.merge(user, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, user);
    });
  });
};

// Deletes a user from the DB.
exports.destroy = function(req, res) {
  User.findById(req.params.id, function (err, user) {
    if(err) { return handleError(res, err); }
    if(!user) { return res.send(404); }
    user.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}

// NEW API REQUEST HANDLERS
exports.add = function(req, res){
  //console.log("ADD");
  // why does this screw up my application and not work?!?!? \/\/\/\/
  // if(badReq(req)){ return res.status(400).json("Bad Request")};
  User.add(req.body.user, req.body.password, function(errCode){
    if(errCode > 0){
      return res.status(200).json({errCode: 1, count: 1});
    } else{
      return res.status(200).json({errCode: errCode});
    }
  });
};

exports.login = function(req, res){
  //console.log("LOGIN");
  // why does this screw up my application and not work?!?!? \/\/\/\/
  // if(badReq(req)){ return res.status(400).json("Bad Request")};
  User.login(req.body.user, req.body.password, function(obj){
    return res.status(200).json(obj);
  })
};

exports.clearDB = function(req, res){
  // console.log("RESET DB");
  User.clearDB(function(errCode){
    if(errCode < 0){
      //console.log("Unable to clear DB");
      return res.status(200).json({errCode: errCode});
    } else{
      //console.log("Successfully cleared DB");
      return res.status(200).json({errCode: errCode});
    }
  });
};

exports.unitTests = function(req, res){
  exec('npm test', function(err, stdout, stderr) {
    var totalTests = NUM_TESTS;
    var numPassed = 0;
    var numFailed = 0;
    console.log('OUT:' + stdout);
    console.log('ERR:' + stderr);
    var array = stdout.toString().match(/[^\r\n]+/g);
    for(var i = 0; i < array.length; i++){
      var line = array[i];
      if(line.search('passing') != -1){
        numPassed = array[i].match(/(\d+)\s/)[0].valueOf();
      }
    }
    numFailed = totalTests - numPassed;
  return res.status(200).json({nrFailed: numFailed, output: stdout, totalTests: totalTests});
  });
};

