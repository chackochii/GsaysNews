import express from 'express';
import { login } from './admin.controller.js';
const router = express.Router();

// POST /api/admin/login
router.post('/login', login)




export default router;
