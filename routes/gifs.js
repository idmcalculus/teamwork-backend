const express = require('express');
const fileUpload = require('express-fileupload');
const { postGifs, getSingleGif, getAllGifs, deleteGif } = require('../controllers/gifs');
const { writeComment } = require('../controllers/gifComments');
const auth = require('../middlewares/auth');

const router = express.Router();

router.use(fileUpload({
  useTempFiles: true,
}));

router.post('/gifs', auth, postGifs);
router.get('/gifs', auth, getAllGifs);
router.get('/gifs/:gifId', auth, getSingleGif);
router.delete('/gifs/:gifId', auth, deleteGif);
router.post('/gifs/:gifId/comment', auth, writeComment);

module.exports = router;