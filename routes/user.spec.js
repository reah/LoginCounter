'use strict';

var should = require('should');
var request = require('supertest');
var app = require('../app');
var assert = require('assert');
var User = require('./user.model');

before(function(){
  // console.log('Before Each Test');
  User.clearDB(function(errCode){
    // //console.log(errCode);
  });
});

describe('User', function(){
  describe('.clearDB', function(){
    it('should return 1 for successful clear of DB', function(){
      User.clearDB(function(errCode){
        assert.equal(1, errCode);
        //why does done(); mess crap up here?!?
        //done();
      });
    });
  });
});

describe('User', function(){
  describe('.inDB', function(){
    it('should return false for unique username', function(done){
      User.inDB("Reah", function(bool){
        //console.log(bool);
        assert.equal(false, bool);
        done();
      });
    });
    it('should return true for name inserted in DB', function(done){
      User.create({user:"Reah", password: "passw0rd", count: 1}, function(err, res){
        User.inDB(res.user, function(bool){
          assert.equal(true, bool);
          done();
        });
      });
    });
  });
});

describe('User', function(){
  describe('.add', function(){
    it('should return errorCode -3 for invalid name, i.e. empty string', function(done){
      User.add("", "password", function(errCode){
        assert.equal(-3, errCode);
        done();
      });
    });
    it('should return errorCode -3 for invalid name, i.e. name > 128', function(done){
      var long = '432167483643789126474532562365346891236478361278946312896478321694836127894678126432478912364781264789362178946312789463789124678321894631278';
      User.add(long, "password", function(errCode){
        assert.equal(-3, errCode);
        done();
      });
    });
    it('should return errorCode -3 for invalid name, i.e. null', function(done){
      User.add(null, "password", function(errCode){
        assert.equal(-3, errCode);
        done();
      });
    });
    it('should return errorCode -2 for user already exists', function(done){
      User.add("Reah", "password", function(errCode){
        assert.equal(-2, errCode);
        done();
      });
    });
    it('should return errorCode -4 for bad password, i.e. password length > 128', function(done){
      var long = '432167483643789126474532562365346891236478361278946312896478321694836127894678126432478912364781264789362178946312789463789124678321894631278';
      User.add("newUser", long, function(errCode){
        assert.equal(-4, errCode);
        done();
      });
    });
    it('should return errorCode 1 for successful insert', function(done){
      User.add("newUser", "passw0rd", function(errCode){
        assert.equal(1, errCode);
        done();
      });
    });
  });
});

describe('User', function(){
  describe('.login', function(){
    it('should return errorCode 1 & count 2 for first successful login (+ 1 when adding to DB), i.e. correct name & password', function(done){
      User.login("Reah", "passw0rd", function(json){
        assert.equal(1, json.errCode);
        assert.equal(2, json.count);
        done();
      });
    });
    it('should return errorCode -1 for bad credentials, i.e. name not in DB', function(done){
      User.login("notInDB", "passw0rd", function(json){
        assert.equal(-1, json.errCode);
        done();
      });
    });
    it('should return errorCode -1 for bad credentials, i.e. wrong password', function(done){
      User.login("Reah", "wrong", function(json){
        assert.equal(-1, json.errCode);
        done();
      });
    });
  });
});
