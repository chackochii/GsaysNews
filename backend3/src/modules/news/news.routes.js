import express from 'express';
import { createNews, listNewsByCategory, editNews, listNews ,getCategories, addCategory, deleteNews, listOneNews } from '../news/news.contoller.js';
import { multerUpload, uploadToGCS } from "../../config/s3.config.js";

const router = express.Router();
router.get('/all', listNews);
router.post('/create',multerUpload.single("image"), uploadToGCS, createNews);
router.get('/category/:category', listNewsByCategory);
router.put('/edit/:id',multerUpload.single("image"), uploadToGCS, editNews);
router.post('/addCategory', addCategory);
router.get('/categories', getCategories);
router.delete('/delete/:id', deleteNews);

router.get('/:id', listOneNews);


export default router;
