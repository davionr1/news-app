
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Articles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Articles.init({
    articlesId:{
      type:DataTypes.SMALLINT,
      primaryKey:true,
      autoIncrement:true,
      field: "articles_id"
    },
    title: article.title,
    author: article.author,
    description: article.description,
    content: article.content,
    url: article.url,
    urlToImage: article.urlToImage,
    source_id: article.source_id,
    source_name: article.source_name,
    publishedAt: article.publishedAt
  }, {
    sequelize,
    modelName: 'articles',
    tableName: 'articles',
    underscored:true
  });
  return Articles;
};