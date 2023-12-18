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
  res.setHeader("Access-Control-Allow-Methods", "POST, GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers");
  next();
})

app.get('/search', async (req, res) => {
  const { q, fromDate, toDate } = req.query

  articleModel.searchArticles(q, fromDate, toDate)
    .then(response => {
      res.status(200).send(response)
      console.log(response, "dates and stuff");
    })
    .catch(error => {
      res.status(500).send(error)
    })
})

app.get('/makeArticles', async (req, res) => {
  const { q } = req.query
  const url = (`https://newsapi.org/v2/top-headlines?q=${encodeURIComponent(q)}&sortBy=publishedAt&apiKey=${api_key}`)
  try {
    const response = await fetch(url)
    const data = await response.json()
    res.send(data.articles)

    try {
      //fix db id numbering later
      articleModel.createArticleInfo(data.articles)
    }
    catch (error) {
      console.error('Error creating data:', error);
    }
  }
  catch (error) {
    console.error('Error fetching data:', error);
  }
})

app.get('/makeNewDataArticles', async (req, res) => {
  const { data } = req.query

  try {
    const newData = JSON.parse(data)
    res.send(newData)
    try {
      //fix db id numbering later
      articleModel.createArticleInfo(newData)
      res.send("work")
    }
    catch (error) {
      console.error('Error creating data:', error);
    }
  }
  catch (error) {
    console.error('Error fetching data:', error);
  }
})

app.get('/makeTopSplitArticles', async (req, res) => {
  const { topData } = req.query
  try {
    try {
      //fix db id numbering later
      await articleModel.createArticleInfo(JSON.parse(topData));
    }
    catch (error) {
      console.error('Error creating data:', error);
    }
  }
  catch (error) {
    console.error('Error fetching the data:', error);
  }
})

app.get('/makeBottomSplitArticles', async (req, res) => {
  const { bottomData } = req.query
  try {
    try {
      //fix db id numbering later
      await articleModel.createArticleInfo(JSON.parse(bottomData));
    }
    catch (error) {
      console.error('Error creating data:', error);
    }
  }
  catch (error) {
    console.error('Error fetching the data:', error);
  }
})

app.listen(process.env.PORT, () => {
  console.log(` ${process.env.PORT}`);
})