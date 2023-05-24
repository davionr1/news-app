'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('newsArticles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      author: {
        type: Sequelize.STRING
      },
      published_date: {
        type: Sequelize.DATE
      },
      published_date_precision: {
        type: Sequelize.STRING
      },
      link: {
        type: Sequelize.STRING
      },
      clean_url: {
        type: Sequelize.STRING
      },
      excerpt: {
        type: Sequelize.STRING
      },
      summary: {
        type: Sequelize.STRING
      },
      rights: {
        type: Sequelize.STRING
      },
      rank: {
        type: Sequelize.INTEGER
      },
      topic: {
        type: Sequelize.STRING
      },
      country: {
        type: Sequelize.STRING
      },
      language: {
        type: Sequelize.STRING
      },
      authors: {
        type: Sequelize.STRING
      },
      media: {
        type: Sequelize.STRING
      },
      is_opinion: {
        type: Sequelize.BOOLEAN
      },
      twitter_account: {
        type: Sequelize.STRING
      },
      _score: {
        type: Sequelize.FLOAT
      },
      _id: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('newsArticles');
  }
};