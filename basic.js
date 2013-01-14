//basic tester

console.log(" Starting test")

var childProcess = require('child_process')
var phantomjs = require('phantomjs')
var binPath = phantomjs.path

var path = require('path')



var fullpath = "phantomjs "+__dirname + "/phantomstuff.js"


var childArgs = [
  path.join(__dirname, 'phantomstuff.js'),
  'http://jeveloper.com'
]



childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
  // handle results

  console.log(" handler got back, %s ", stdout)
})

