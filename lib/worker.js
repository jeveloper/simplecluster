
var 
kue = require('kue'), 
jobs = kue.createQueue(),
Job = kue.Job;

var childProcess = require('child_process'),
phantomjs = require('phantomjs'),
binPath = phantomjs.path,
path = require('path');






jobs.process('preview_url', function(job, done){

	console.log ("about to work on %s", job.data.url )


	var childArgs = [
	path.join(__dirname, 'phantomstuff.js'),
	job.data.url
	]

//TODO i need to interact with phantomjs through specific messages, error handling
//TODO grab a filename generated and pass back to record 

childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {

	console.log(" handler got back, %s ", stdout);


	if ( err ) {
		console.log( err )
		done( err );
		return false;
	};

		done(); //We are done, flagging for removal

	});






});