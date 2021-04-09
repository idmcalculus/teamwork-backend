const db = require('./index');

module.exports = () => {
	const gifsCommentsTable = async () => {
		try {
			await db.query(`CREATE TABLE IF NOT EXISTS gifs_comments (
							commentId serial PRIMARY KEY, 
							comment VARCHAR (50) NOT NULL,
							createdOn timestamp with time zone NOT NULL,
							gifId INTEGER NOT NULL,
							createdBy VARCHAR (50) NOT NULL
							)`);
		} catch (err) {
			console.error(err);
		}
	};

	gifsCommentsTable();
};
