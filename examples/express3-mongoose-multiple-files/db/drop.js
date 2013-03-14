// synchronous functions
var seq = require("parseq").seq;
// db connect
var db = require('./schema');

desc('Drop all MongoDB data');
task('drop', [], function () {

	seq(
		function f1() {
			db.mongoose.connection.db.dropDatabase(this);
		}, 
		function done(err) {
			if(err) {
				console.log(err);
			} else {
				console.log('Successfully dropped db');
			}
			db.mongoose.connection.close();
			console.log('Closed mongodb connection');
		}
	);
});
