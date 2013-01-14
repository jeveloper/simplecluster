 
//CLIENT
var mysql      = require('mysql'),
kue = require('kue'), 
jobs = kue.createQueue(),
Job = kue.Job,
parse      = require('./parse'),
connection = mysql.createConnection({
	host     : '127.0.0.1',
	user     : 'rogers',
	password : 'rogers',
	database : 'belldata'
});


var sql = " \
select * from bell_address \
where postal_zip_code NOT IN (select postal_zip_code from bell_availability where available = 'y' or available = '3months') \
and region  not IN ('QC')  \
and street_number is not null  \
order by postal_zip_code DESC \
limit 0,100 \
";



//THIS IS A GROUP BY query and exclude THOSE we already processed
var sql = " \
select * from bell_address \
where postal_zip_code NOT IN (select postal_zip_code from bell_availability ) \
and region  not IN ('QC')  \
and street_number is not null  \
group by postal_zip_code  \
limit 500 \
";



//TESTING

/*
var sql = " \
select * from bell_address \
where postal_zip_code IN ('E1E0C5') \
and region  not IN ('QC')  \
order by postal_zip_code DESC \
limit 100 \
";

*/
var jobcounter = 0;

connection.connect();
connection.query(sql, 
	function(err, rows, fields) {
		if (err) throw err;

		console.log(" rows returned %s: ", rows.length);

		for( var r in rows ) {
			var row = rows[r];


			var street_type = row.STREET_TYPE;
			if (!row.STREET_TYPE)
				street_type = "";


					jobs.create('ask_bell', {
				            // Title will show up in UI
				            title: row.POSTAL_ZIP_CODE,
				            street_number : row.STREET_NUMBER.trim(),
				            street_name : row.STREET_NAME.replace("'",""),
				            street_type : row.STREET_TYPE,
				            postal_code : row.POSTAL_ZIP_CODE,
				            city : row.CITY,
				            province: row.REGION 
				    }).priority('normal').attempts(3).save();

				    console.log("Job counting %d",++jobcounter);

				    //clearnup
				    row = {};
				  
		
  		  	}//for loop	

	console.log(" Finished creating jobs ");


});



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


