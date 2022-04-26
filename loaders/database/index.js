import Sequelize from 'sequelize';
import { privateKey } from '../../config/privateKeys.js';

//   console.log(privateKey);

const dbConfig = {

	dialect: "mysql",
	database: privateKey.DB_NAME,
	username: privateKey.DB_USER_NAME,
	password: privateKey.DB_PASSWORD,
	host: privateKey.DB_HOST,
	dialectOptions: {
		// useUTC: false, //for reading from database
		connectTimeout:100000,
		dateStrings: true,
		typeCast: true,
		timezone: "+05:30"
	},
	timezone: "+05:30" //for writing to database
};

const sequelize = new Sequelize(dbConfig);

const databaseLoader = async () => new Promise((resolve, reject) => {
	sequelize.authenticate()
		.then(async db => {
			console.log('Database connection established');
			resolve(db);
		})
		.catch(reject);
});

export { databaseLoader, sequelize };
