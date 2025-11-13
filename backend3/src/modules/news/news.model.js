import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';

const NewsModel = sequelize.define('News', {
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  articleContent: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  uploadedImage: {
    type: DataTypes.STRING,
    allowNull: true
  },
  deletedat: {
    type: DataTypes.DATE,
    allowNull: true
  }
});

export default NewsModel;
