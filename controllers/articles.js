require('../models/database/articles')();
const db = require('../models/database/index');
const randomId = require('../models/database/identity');
const { validatePost, validateEdit } = require('../models/validators/articles');

const today = new Date();
const date = `${today.getFullYear()}-${(today.getMonth() + 1)}-${+today.getDate()}`;
const time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
const dateTime = `${date} ${time}`;

class ArticleController {
  static async createSingleArticle(req, res) {
    try {
      const { error } = validatePost(req.body);
      if (error) {
        return res.status(400).json({
          status: 'error',
          error: error.details[0].message,
        });
      }
  
      const { title, article, categoryId } = req.body;
      const createdOn = dateTime;
      const articleId = randomId(5484621);
      const category = await db.query(`SELECT * FROM categories WHERE categoryId = ${categoryId}`);
      if (category.rows.length === 0) {
        return res.status(404).json({
          status: 'error',
          error: 'Category with the specified categoryId NOT found',
        });
      }
  
      const createdBy = req.body.email;
  
      await db.query(
        `INSERT INTO articles (articleId, title, article, createdOn, categoryId, createdBy) 
          VALUES ($1, $2, $3, $4, $5, $6)`, [articleId, title, article, createdOn, categoryId, createdBy],
      );
      return res.status(201).json({
        status: 'success',
        data: {
          message: 'Article successfully posted',
          articleId,
          createdOn,
          title,
        },
      });
    } catch (err) {
		res.status(400).json({
			status: 'error',
			data: err
		});
    }
  }

  static async getAllArticles(req, res) {
    try {
      const articles = await db.query('SELECT * FROM articles ORDER BY createdOn DESC');
      return res.status(200).json({
        status: 'success',
        data: articles.rows,
      });
    } catch (err) {
		res.status(400).json({
			status: 'error',
			data: err
		});
    }
  }

  static async getSingleArticle(req, res) {
    try {
      const { articleId } = req.params;
      const article = await db.query(`SELECT * FROM articles WHERE articleId = ${articleId}`);
      if (article.rows.length === 0) {
        return res.status(404).json({
          status: 'error',
          error: 'Article with the specified articleId NOT found',
        });
      }
      return res.status(200).json({
        status: 'success',
        data: article.rows[0],
      });
    } catch (err) {
		res.status(400).json({
			status: 'error',
			data: err
		});
    }
  }

  static async updateSingleArticle(req, res) {
    try {
      const { error } = validateEdit(req.body);
      if (error) return res.status(400).json({ message: error.details[0].message });
  
      const { articleId } = req.params;
  
      const owner = await db.query(`SELECT * FROM articles WHERE articleId = ${articleId}`);
      if (owner.rowCount === 0) return res.status(404).json({ message: 'Article Not Found' });
      if (owner.rows[0].createdby !== req.user.email) {
        return res.status(403).json({
          status: 'error',
          message: 'You cannot edit this article',
        });
      }
      const { title, article } = req.body;
      await db.query(
        `UPDATE articles
          SET title = $1, article = $2
          WHERE articleId = ${articleId}`,
        [title, article],
      );
  
      return res.status(201).json({
        status: 'success',
        data: {
          message: 'Article successfully updated',
          title,
          article,
        },
      });
    } catch (err) {
		res.status(400).json({
			status: 'error',
			data: err
		});
    }
  }

  static async deleteSingleArticle(req, res) {
    try {
      const { articleId } = req.params;

      const owner = await db.query(`SELECT * FROM articles WHERE articleId = ${articleId}`);
      if (owner.rowCount === 0) return res.status(404).json({ message: 'Article Not Found' });
      if (owner.rows[0].createdby !== req.body.email) {
        return res.status(403).json({
          status: 'error',
          message: 'You cannot delete this article',
        });
      }
  
      await db.query(`DELETE FROM articles WHERE articleId = ${articleId}`);
      return res.status(202).json({
        status: 'success',
        data: {
          message: 'Article succesfully deleted',
        },
      });
    } catch (err) {
		res.status(400).json({
			status: 'error',
			data: err
		});
    }
  }

  static async getArticlesInCategory(req, res) {
    try {
      const { categoryId } = req.params;
      const article = await db.query(`SELECT * FROM articles WHERE categoryId = ${categoryId}`);
      if (article.rows.length === 0) {
        return res.status(404).json({
          status: 'error',
          error: 'No articles in the specified Category',
        });
      }
      return res.status(200).json({
        status: 'success',
        data: article.rows,
      });
    } catch (err) {
		res.status(400).json({
			status: 'error',
			data: err
		});
    }
  }
}

module.exports = ArticleController;