// synchronous functions
var seq = require("parseq").seq;
// db connect
var db = require('./schema');

// Create a new user and save it in the database
function createUser(parentobj, user, emailaddress, pass, adm) {
	var user = new db.userModel({ username: user
					, email: emailaddress
					, password: pass
					, admin: adm });
	user.save(function(err) {
		if(err) {
			console.log(err);
			parentobj(err);
		} else {
			console.log('saved user: ' + user.username);
			parentobj(err);
		}
	});

}

desc('Seed MongoDB with initial data');
task('seed', [], function () {

	seq(
		function f1() {
			createUser(this, 'admin', 'admin@example.com', 'secret', true);
		}, 
		function f2() {
			createUser(this, 'bob', 'bob@example.com', 'secret', false);
		}, 
		function done(err) {
			if(err) {
				console.log(err);
			} else {
				console.log('successfully seeded db');
			}
			db.mongoose.connection.close();
			console.log('Closed mongodb connection');
		}
	);
});
