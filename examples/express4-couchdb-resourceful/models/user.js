
var resourceful = require('resourceful');

var User = module.exports = resourceful.define('user', function () {

  this.string('name');
  this.string('password');

  this.timestamps();

});

