require('dotenv').config()
const express = require('express')
const app = express()
const { Sequelize, DataTypes } = require('sequelize')
const sequelize = new Sequelize(process.env.PG_URI)
const api_key = process.env.API_KEY
const cors = require('cors');
const { Articles } = require('./models/Articles');
const articleModel = require('./models/ArticlesModel');
const fetch = require('cross-fetch');

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


app.get('/search', async (req, res) => {
  const { query } = req.query

   articleModel.searchArticles(query)
    .then(response => {
      res.status(200).send(response)
      console.log(response);
    })
    .catch(error => {
      res.status(500).send(error)
    })
})



app.get('/makeArticles', async (req, res) => {
  const { q } = req.query

  const url = `https://newsapi.org/v2/top-headlines?q=${encodeURIComponent(q)}&sortBy=publishedAt&apiKey=${api_key}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    res.send(data)
    try {
      // articleModel.createArticleInfo(data.articles)
    }
    catch (error) {
      console.error('Error creating data:', error);
    }

  }
  catch (error) {
    console.error('Error fetching data:', error);
  }
})



app.listen(process.env.PORT, () => {
  console.log(` ${process.env.PORT}`);
})