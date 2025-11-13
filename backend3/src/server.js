import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import adminRoutes from './modules/admin/admin.routes.js';
import newsRoutes from './modules/news/news.routes.js';
import { sequelize } from './config/database.js';
dotenv.config();

import './modules/admin/admin.model.js';
import './modules/news/news.model.js';

const app = express();
// app.use(cors());
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Authorization', 'Content-Type'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ...existing code...

// Use admin and news routes
app.use('/api/admin', adminRoutes);
app.use('/api/news', newsRoutes);



const PORT = process.env.PORT || 5010;
sequelize.authenticate()
  .then(() => {
    console.log('✅ Sequelize DB connected');
    return sequelize.sync();
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅Backend server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Unable to connect to DB:', err.message);
    process.exit(1);
  });