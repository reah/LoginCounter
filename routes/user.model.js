'use strict';

var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var UserSchema = new Schema({
	user: String,
	password: String,
	count: {type: Number, default: 1}
});

// public class member variables
var SUCCESS = 1;
var ERR_BAD_CREDENTIALS = -1;
var ERR_USER_EXISTS = -2;
var ERR_BAD_USERNAME = -3;
var ERR_BAD_PASSWORD = -4;
var ERR_CLEAR_DB_FAIL = -5;
var MAX_USERNAME_LENGTH = 128;
var MAX_PASSWORD_LENGTH = 128;

UserSchema.statics.add = function(name, pw, callback){
	var User = mongoose.model('User');
	var username = name;
	var pass = pw;
	if(username === null || username === '' || username.length > MAX_USERNAME_LENGTH){
		//console.log("bad username")
		return callback(ERR_BAD_USERNAME)
	}
	User.inDB(username, function(bool){
		if(bool){
			//console.log("user already exists in DB");
			return callback(ERR_USER_EXISTS);
		} else{
			if(pass.length > MAX_PASSWORD_LENGTH){
				//console.log("password is greater than 128 chars")
				return callback(ERR_BAD_PASSWORD)
			} else{
				//console.log("inserting in DB");
				User.create({user: username, password: pass, count: 1}, function(err, result){
					if(err)
						console.error("Error throw in creating user")
					else{
						callback(SUCCESS)				
					}
				});
			}
		}
	})
}

UserSchema.statics.inDB = function (name, callback){
	var User = mongoose.model('User');
	//console.log('checking to see if ' + name + ' in DB');
	User.findOne({user: name}, function(err, user){
		if(err){
			console.log("ERROR");
		}
    	//not found
    	if(!user){
    		//console.log("User not found");
    		return callback(false);
	    }
	    //found
	    else{
	    	//console.log("User found");
	    	return callback(true);
	    }
	})
};

UserSchema.statics.login = function(name, pw, callback){
	var User = mongoose.model('User');
	//console.log("logging in");
	User.findOne({user: name}, function(err, user){
		if(err){
			console.log("Error finding user");
		} 
		if(!user){
			//console.log("User not found");
			return callback({errCode: ERR_BAD_CREDENTIALS});
		} else{
			//console.log("User found, now checking pasword");
			if(pw === user.password){
				//console.log("Password matches");
				//console.log("incrementing count");
				user.count += 1;
				user.save();
				return callback({errCode: SUCCESS, count: user.count})
			} else{
				return callback({errCode: ERR_BAD_CREDENTIALS})
			}
		}
	})
};

UserSchema.statics.clearDB = function(callback){
	var User = mongoose.model('User');
	User.remove({}, function(err){
		if(err){
			console.log("Error clearing DB");
			return callback(ERR_CLEAR_DB_FAIL);
		} else{
			return callback(SUCCESS);
		}
	});
};

module.exports = mongoose.model('User', UserSchema);