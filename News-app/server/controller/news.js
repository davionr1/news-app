const express = require('express');
const axios = require('axios');
const newsArticles = require('../models/newsArticles');

const router = express.Router();

router.get('/fetch', async (req, res) => {
  const apiKey = 'your_news_api_key';
  const url = 'https://newsapi.org/v2/top-headlines?q=US%20debt&sortBy=publishedAt';

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    const articles = response.data.articles;

    // Save articles in the database
    for (const article of articles) {
      await Article.create({
        title: article.title,
        description: article.description,
      });
    }

    res.json({ message: 'Data inserted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

module.exports = router;