import Sequelize from 'sequelize';
const { DataTypes } = Sequelize;
import { sequelize } from '../../loaders/index.js';

const SKUS = sequelize.define('skus',{  
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	admin_id:{
		type: DataTypes.INTEGER,
	},
	productName: { 
		type: DataTypes.STRING,
	},
    manufacturingDate: { 
		type: DataTypes.DATE,
	},
	skuID: {
		type: DataTypes.STRING,
	},
	expiry:{
      type:DataTypes.DATE,
	},
	companyName:{
		type: Sequelize.STRING, 
	},
    specialInstruction:{
		type: Sequelize.TEXT, 
	},
    productImage:{
		type: Sequelize.STRING, 
	},
    batchNumber:{
		type: Sequelize.INTEGER, 
	},
    weight:{
		type: Sequelize.DECIMAL(10,3), 
	},
    mrp:{
		type: Sequelize.DECIMAL(10,2),
	},
    manufacturedBy:{
		type: Sequelize.STRING, 
	},
    flashMessage:{
		type: Sequelize.STRING, 
	},
	qrCode:{ 
		type: DataTypes.STRING,
	},
	createdAt: DataTypes.DATE,
	updatedAt: DataTypes.DATE
});

export { SKUS };
