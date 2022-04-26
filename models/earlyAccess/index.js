import Sequelize from 'sequelize';
const { DataTypes } = Sequelize;
import { sequelize } from '../../loaders/index.js';

const EARLYACCESS = sequelize.define('earlyaccess',{
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	email: { 
		type: DataTypes.STRING,
	},
	createdAt: DataTypes.DATE,
	updatedAt: DataTypes.DATE
});

export { EARLYACCESS };
