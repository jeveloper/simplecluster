
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




//Optional do stuff in parallel , hmm not sure about clustering like this

  jobs.process('ask_bell', function(job, done){
    //check if there is already available this postal code and its YES 

        //if exists as available , SKIP the JOB , call done
var sql = "select count(*) as tally from bell_availability where postal_zip_code = '"+job.data.postal_code+"' and (available = 'y' or available = '3months') ";
        //if NOT available 
connection.query(sql, function(err, rows, fields) {
		  if (err) throw err;


		  if ( rows[0].tally == 0 ){


		  	 parse.process_address( job.data, function process_handler(o,resp,err) {
	        if ( err !== undefined ) return done(err);

	        console.log("Postal Code: %s Response: Avail: %s, Exists %s, Community: %s , Street #: %s, Name: %s , %s",job.data.postal_code, resp.available,resp.exists, resp.community, o.street_number, o.street_name,o.province);

			  	var opts = {
	            postal_zip_code: o.postal_code,
	            available: resp.available,
	            exists: resp.exists,
	            community: resp.community.replace("'",""),
	            street_number : o.street_number,
	            street_name: o.street_name,
	            province: o.province,
	            city: o.city
	            
		        };


		        if (opts.exists == 'n'){
		        	opts.available = 'notfound';
		        }


		        connection.query( 'insert into bell_availability set ? , date_checked = now() ' +
		                         "on duplicate key update `available`='"+opts.available+
		                         "',`exists`='"+opts.exists+"' "+
		                         ", community= '"+opts.community+"'" +
		                         ", street_number = "+connection.escape(o.street_number)+" , street_name = "+connection.escape(o.street_name)+" , city = "+connection.escape(o.city)+"  " +
		                         ", date_checked = NOW() ",
		            opts, function( err ) {
	                if ( err ) {
	                    console.log( err )
	                    done( err );
	                    return false;
	                };
	                done();
	            });//end INSERT/UPDATE



			});//END process address


		  }//END counting the case 
		  else{
		  	console.log("<<<<<<<<<<<<<<<<<<<<<<<< Skipping %s because its available ",job.data.postal_code);
		  	done();
		  }

    });//END QUERY 


});