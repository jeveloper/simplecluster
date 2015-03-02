var cluster = require("cluster");
var redis = require('redis');
var kue = require('kue');

var numCPUs = require('os').cpus().length;

//10 is usually enough for stable service on a dual core chip (my laptop)


//Should this process exit once al jobs are complete
//set a setTimeout().. check every 30 minutes for job queue and then
//process.exit(code=0)


var client = redis.createClient(6379, '127.0.0.1').on("ready", function()
{

  console.log(" connected to redis and about to Flush");
  client.flushall();
  console.log("Flushed All keys");

}
);


cluster.setupMaster({
  exec : "worker.js",
  args : ["--use", "https"],
  silent : false
});


console.log(" started cluster");

//i am practical, this handler will keep the worker processes running

cluster.on('exit', function(worker, code, signal) {
  var exitCode = worker.process.exitCode;
  console.log('worker ' + worker.process.pid + ' died with code: ('+exitCode+'). restarting...');
  cluster.fork();
});




for (var i = 0; i < numCPUs; i++) {
  cluster.fork();
}


kue.app.set('title', 'Control Centre');  
kue.app.listen(3000);
console.log("STARTED UP UI FOR KUE");

cluster.on('online', function(worker) {
  console.log("Yay, the worker responded after it was forked , workerID #%s ",worker.process.pid);
});