import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';

const Admin = sequelize.define('Admin', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  joined: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  otherInfo: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
});

export default Admin;
