import Sequelize from 'sequelize';
const { DataTypes } = Sequelize;
import { sequelize } from '../../loaders/index.js';

const ADMIN = sequelize.define('admins',{
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	email: { 
		type: DataTypes.STRING,
	},
    name: { 
		type: DataTypes.STRING,
	},
	password: {
		type: DataTypes.STRING,
	},
	otp:{
      type:DataTypes.INTEGER,
	},
	isVerified:{
		type: Sequelize.BOOLEAN, 
		defaultValue: true
	},
	createdAt: DataTypes.DATE,
	updatedAt: DataTypes.DATE
});

export { ADMIN };
