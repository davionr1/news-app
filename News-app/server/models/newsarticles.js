'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class newsArticles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  newsArticles.init({
    title: DataTypes.STRING,
    author: DataTypes.STRING,
    published_date: DataTypes.DATE,
    published_date_precision: DataTypes.STRING,
    link: DataTypes.STRING,
    clean_url: DataTypes.STRING,
    excerpt: DataTypes.STRING,
    summary: DataTypes.STRING,
    rights: DataTypes.STRING,
    rank: DataTypes.INTEGER,
    topic: DataTypes.STRING,
    country: DataTypes.STRING,
    language: DataTypes.STRING,
    authors: DataTypes.STRING,
    media: DataTypes.STRING,
    is_opinion: DataTypes.BOOLEAN,
    twitter_account: DataTypes.STRING,
    _score: DataTypes.FLOAT,
    _id: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'newsArticles',
  });
  return newsArticles;
};