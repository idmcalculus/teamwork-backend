const dotenv = require('dotenv');
const { Client } = require('pg');

dotenv.config();

const conString = process.env.DB_URL;
const client = new Client(conString);

client.connect(function(err) {
	if (err) {
	  return console.error("could not connect to postgres", err);
	}

	client.query('SELECT NOW() AS "theTime"', function(err, result) {
	  if (err) {
		return console.error("error running query", err);
	  }
	  console.log("Database Connected");
	});
});

/* const connectClient = async () => {
	try {
	  await client.connect();
	  const result = await client.query('SELECT NOW() AS "theTime"');
	  console.log(result.rows[0])
	  console.log("Database Connected");
	} catch (err) {
	  console.error(err);
	} finally {
	  client.end();
	}
}
  
connectClient(); */
  
module.exports = client;