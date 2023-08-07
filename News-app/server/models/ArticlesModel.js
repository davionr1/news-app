require('dotenv').config()
const express = require('express')
const app = express()
const { Sequelize, DataTypes } = require('sequelize')
const sequelize = new Sequelize(process.env.PG_URI)
const sqlite3 = require('sqlite3')
const axios = require("axios").default;
const api_key = process.env.API_KEY
const fetch = require('cross-fetch');

// Sync the model with the database
sequelize.sync().then(() => {
  console.log('Database is synced. ');
});

const searchArticles = async (articleSearch) => {
  try {
    const searchTerm = `%${articleSearch}%`

    const query = `
  SELECT * 
  FROM articles
  WHERE (title) ILIKE '%${searchTerm}%'
  OR (content) ILIKE '%${searchTerm}%'
  OR (description) ILIKE '%${searchTerm}%'
  OR (author) ILIKE '%${searchTerm}%'
  OR (source_id) ILIKE '%${searchTerm}%'
  OR (source_name) ILIKE '%${searchTerm}%'
`;
    const [rows] = await sequelize.query(query, { replacements: { searchTerm } });

    if (rows.length > 0) {
      console.log("Data found in the database");
      return rows
    }
    else{
        console.log("No data found in the database");
        return [];
    }
   

  }
  catch { }
}

const createArticleInfo = async (articles) => {
  try {
    for (const article of articles) {
      const { title, author, description, publishedAt, source, url, urlToImage, content } = article;

      const { id, name } = source;

      const query = `
        INSERT INTO articles (title, author, description, published_at, url_to_image, source_id, source_name, url, content) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      await sequelize.query(query, {
        replacements: [
          title ?? null,
          author ?? null,
          description ?? null,
          publishedAt ?? null,
          urlToImage ?? null,
          id ?? null,
          name ?? null,
          url ?? null,
          content ?? null
        ]
      });
    }
  } catch (error) {
    console.error(error);
  }
};

const deleteArticleInfo = () => {
  sequelize.query(`SELECT FROM articles where id=$1`, [id], (err, res) => {
    if (err) {
      console.log("error deleting");
    }
    else {
      console.log(`${id} article has been deleted`);
    }
  })
}

module.exports = {
  deleteArticleInfo,
  createArticleInfo,
  searchArticles
}