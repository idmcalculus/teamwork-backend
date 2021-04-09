const db = require('./index');

module.exports = () => {
  const categoriesTable = async () => {
    try {
      await db.query(`CREATE TABLE IF NOT EXISTS categories (
        categoryId serial PRIMARY KEY, 
        categoryName VARCHAR (50) UNIQUE NOT NULL)`);
    } catch (err) {
      console.error(err);
    }
  };

  categoriesTable();
};
  