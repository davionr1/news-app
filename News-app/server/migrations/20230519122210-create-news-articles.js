'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('articles', {
      articlesId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey:true,
        field:"articles_id",
        type:Sequelize.INTEGER

      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      author: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      urlToImage: {
        type: Sequelize.STRING,
        allowNull: true,
        field:"url_to_image"
      },
      source: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      publishedAt: {
        type: Sequelize.STRING,
        allowNull: false,
        field: "published_at"
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('articles');
  }
};