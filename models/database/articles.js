const db = require('./index');

module.exports = () => {
  const articlesTable = async () => {
    try {
      await db.query(`CREATE TABLE IF NOT EXISTS articles (
                    articleId serial PRIMARY KEY, 
                    title VARCHAR (50) NOT NULL,
                    article VARCHAR (2500) NOT NULL,
                    createdOn timestamp with time zone NOT NULL,
                    categoryId INTEGER NOT NULL,
                    createdBy VARCHAR (50) NOT NULL
                    )`);
    } catch (err) {
      console.error(err);
    }
  };

  articlesTable();
};