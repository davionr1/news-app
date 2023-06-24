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

const getArticleInfo = async(req,res) => {

    try {
      const response = await axios.get(
        `https://newsapi.org/v2/top-headlines?q=us debt&sortBy=publishedAt&apiKey=${api_key}`
      );
      const articles = response.articles
      console.log(articles);
      // createArticleInfo(articles);
    } catch (error) {
      console.error('Error retrieving articles:', error.message);
    }

    // sequelize.query(`SELECT * FROM articles ORDER BY id ASC`, (err,res)=>{
    //   if(err){
    //     console.log("Error retrieving Article");
    //   }
    //   else{
    //     console.log("Retrieved Article", res.rows);
    //   }
    // })
  
}

const createArticleInfo = async (articles) => {
  try {
    for (const article of articles) {
      // Perform operations on each individual article
      const { title, author, description, publishedAt, source, url, urlToImage, content } = article;

      const query = `INSERT INTO articles (title, author, description, published_at, url_to_image, source, url, content) 
      VALUES ('${title}', '${author}', '${description}', '${publishedAt}', '${urlToImage}', '${source}', '${url}', '${content}')`;
      sequelize.query(query, (err, res) => {
        if (err) {
          console.log("cannot complete");
        }

      })
    }
  } catch (error) {
    console.error(error);

  }
}

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
  getArticleInfo
}