const { Router } = require('express');
const { requireSignin, getAudiobook } = require('../middleware');
const { getAudioBooks, giveReviews, getAudioBooksById, createAudioBook, filterAudiobooks, searchAudiobooks, getabImage } = require('../controller/audiobook');


const router = Router();

router.post('/', requireSignin, createAudioBook);
router.get('/', getAudioBooks);
router.get('/:id',  getAudiobook, getAudioBooksById);
router.post('/:id/reviews', requireSignin, getAudiobook, giveReviews);
router.post('/filter', filterAudiobooks);
router.post('/search', searchAudiobooks);


module.exports = router;