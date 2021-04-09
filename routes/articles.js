const express = require('express');
const { createSingleArticle, getAllArticles, getSingleArticle, updateSingleArticle, deleteSingleArticle } = require('../controllers/articles');
const { writeComment } = require('../controllers/articleComments');
const auth = require('../middlewares/auth');

const router = express.Router();

router.post('/articles', auth, createSingleArticle);
router.get('/articles', auth, getAllArticles);
router.get('/articles/:articleId', auth, getSingleArticle);
router.patch('/articles/:articleId', auth, updateSingleArticle);
router.delete('/articles/:articleId', auth, deleteSingleArticle);
router.post('/articles/:articleId/comment', auth, writeComment);

module.exports = router;