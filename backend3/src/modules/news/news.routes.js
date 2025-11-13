import express from 'express';
import { createNews, listNewsByCategory, editNews, listNews } from '../news/news.contoller.js';
import { upload } from '../../config/s3.config.js';

const router = express.Router();

router.get('/all', listNews);
router.post('/create', upload.single('image'), createNews);
router.get('/category/:category', listNewsByCategory);
router.put('/edit/:id', upload.single('image'), editNews);


export default router;
