'use strict';

export default {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable('admins', {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      email: {
        type: Sequelize.DataTypes.STRING,
      },
      name: {
        type: Sequelize.DataTypes.STRING,
      },
      password: {
        type: Sequelize.DataTypes.STRING,
      },
      otp: {
        type: Sequelize.DataTypes.INTEGER,
      },
      isVerified:{
        type: Sequelize.DataTypes.BOOLEAN, 
        defaultValue: true
      },
      createdAt: Sequelize.DataTypes.DATE,
      updatedAt: Sequelize.DataTypes.DATE
		});
  },
  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('admins');
  }
}; 