 
//CLIENT
var 
kue = require('kue'), 
jobs = kue.createQueue(),
Job = kue.Job;


var urls = ["http://jeveloper.com","https://google.com","http://news.ycombinator.com"]


key=0; while (key<urls.length){


url = urls[key];
console.log (" URL IS %s",url);


jobs.create('preview_url', {
				            // Title will show up in UI
				            title: url,
				            url: url
				        }).priority('normal').attempts(3).save();

key++;

}

jobs.on('job complete', function(id){
	Job.get(id, function(err, job){
		if (err) return;

 			//CLEANUP
 			job.data = {};

 			job.remove(function(err){
 				if (err) throw err;
 				console.log('removed completed job #%d , on %s', job.id, new Date());
 			});
 		});
});		


