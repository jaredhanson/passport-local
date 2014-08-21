var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var SALT_WORK_FACTOR = 10;
var userSchema = mongoose.Schema({
  local: {
    email: String,
    password: String
  }
});
// Encrypt password before save and on password change.
function encryptPassword(user, next){
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
    if(err){
      return next(err);
    }
    bcrypt.hash(user.local.password, salt, null, function(err, hash){
      if(err){
        return next(err);
      }
      user.local.password = hash;
      next();
    });
  });
}
// Presave routine
userSchema.pre('save', function(next) {
  var user = this;
  if(!user.isNew && !user.isModified('local.password')){
    return next();
  }
  encryptPassword(user, next);
});
userSchema.methods.validPassword = function(password,next) {
  bcrypt.compare(password, this.local.password, next);
};
module.exports = mongoose.model('User', userSchema);
