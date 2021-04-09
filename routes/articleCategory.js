const express = require('express');
const { getArticlesInCategory } = require('../controllers/articles');
const { getAllCategories, getSingleCategory, createSingleCategory, updateSingleCategory, deleteSingleCategory } = require('../controllers/articleCategory');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');

const router = express.Router();

router.get('/categories', auth, admin, getAllCategories);
router.get('/categories/:id', auth, admin, getSingleCategory);
router.post('/categories', auth, admin, createSingleCategory);
router.patch('/categories/:id', auth, admin, updateSingleCategory);
router.delete('/categories/:id', auth, admin, deleteSingleCategory);
router.get('/categories/:categoryId/articles', auth, getArticlesInCategory);

module.exports = router;