require('dotenv').config()
const express = require('express')
const app = express()
const { Sequelize, DataTypes } = require('sequelize')
const sequelize = new Sequelize(process.env.PG_URI)
const sqlite3 = require('sqlite3')
const axios = require("axios").default;
const api_key = process.env.API_KEY

// Sync the model with the database
sequelize.sync().then(() => {
  console.log('Database is synced. ');
});



const getArticles = async () => {
  return new Promise(function (resolve, reject) {
    sequelize.query(`SELECT * FROM articles ORDER BY articles_id ASC `, (err, res) => {
      if (err) {
        reject("Error retrieving Article");
      }
      else {
        resolve("Retrieved Article", res.rows);
      }
    })
  })
}

const searchArticles = async (articleSearch) => {
  try {

    const query = `
      SELECT * 
      FROM articles
      WHERE title LIKE '%${articleSearch}%'
      OR content LIKE '%${articleSearch}%'
      OR description LIKE '%${articleSearch}%'
    `;
    const [rows] = await sequelize.query(query);
    console.log(rows); // Handle the retrieved articles data
  } catch (error) {
    console.error('Error fetching articles:', error);
  }
};



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
  getArticles,
  createArticleInfo,
  searchArticles
}