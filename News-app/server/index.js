require('dotenv').config()
const express = require('express')
const app = express()
const axios = require("axios").default;
const { Sequelize, DataTypes } = require('sequelize')
const sequelize = new Sequelize(process.env.PG_URI)
const api_key = process.env.API_KEY
const cors = require('cors');

const articleModel = require('./models/newsArticleModel')

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers");
  next();
})


app.get('/articles', async (req, res) => {
  articleModel.getArticleInfo()
  .then(response =>{
    res.status(200).send(response)
  })
  .catch(error =>{
    res.status(500).send(error)
  })

  const createArticleInfo = async (articles) => {
    try {
      for (const article of articles) {
        // Perform operations on each individual article
        const { title, author, description, publishedAt, source, url, urlToImage, content } = article;
        
        const query = `INSERT INTO articles (title, author, description, published_at, url_to_image, source, url, content) 
        VALUES ('${title}', '${author}', '${description}', '${publishedAt}', '${urlToImage}', '${source}', '${url}', '${content}')`;
        sequelize.query(query, (err, res)=>{
          if (err){
            console.log("cannot complete");
          }
          
        })  
           }
    } catch (error) {
      console.error(error);
      
    }
    }
  
  
});



app.listen(process.env.PORT, () => {
  console.log(` ${process.env.PORT}`);
})