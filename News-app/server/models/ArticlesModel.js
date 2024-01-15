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

const searchArticles = async (q, fromDate, toDate, page, pageSize) => {
  try {

    const offset = (page - 1) * pageSize;
    const endIndex = page * pageSize

    const searchTerm = `%${q}%`;
    const from = fromDate;
    const to = toDate;
    let query;
    let countQuery;

    console.log("test", fromDate, toDate);
    if (!from && !to) {
      // Query with date range condition
      query = `
    SELECT *
    FROM articles
    WHERE (
      (title ILIKE '%${searchTerm}%'
        OR content ILIKE '%${searchTerm}%'
        OR description ILIKE '%${searchTerm}%'
        OR author ILIKE '%${searchTerm}%'
        OR source_id ILIKE '%${searchTerm}%'
        OR source_name ILIKE '%${searchTerm}%')
    )
    ORDER BY published_at DESC
     LIMIT ${pageSize}
     OFFSET ${offset}`;

      countQuery = `SELECT COUNT(*) as totalCount FROM articles 
    WHERE(
      title ILIKE '%${searchTerm}%'
        OR content ILIKE '%${searchTerm}%'
        OR description ILIKE '%${searchTerm}%'
        OR author ILIKE '%${searchTerm}%'
        OR source_id ILIKE '%${searchTerm}%'
        OR source_name ILIKE '%${searchTerm}%'
      )`;
    }
    else if (from && to) {
      console.log("workinggggg");
      // Query without date range condition
      query = `
        SELECT *
        FROM articles
        WHERE (
          (title) ILIKE '%${searchTerm}%'
          OR (content) ILIKE '%${searchTerm}%'
          OR (description) ILIKE '%${searchTerm}%'
          OR (author) ILIKE '%${searchTerm}%'
          OR (source_id) ILIKE '%${searchTerm}%'
          OR (source_name) ILIKE '%${searchTerm}%'
          )
          AND published_at BETWEEN '${from}' AND '${to}'
           ORDER BY published_at DESC
           LIMIT ${endIndex}
           OFFSET ${offset}`;

      countQuery = `
           SELECT COUNT(*) as totalCount
           FROM articles
           WHERE (
            (title) ILIKE '%${searchTerm}%'
            OR (content) ILIKE '%${searchTerm}%'
            OR (description) ILIKE '%${searchTerm}%'
            OR (author) ILIKE '%${searchTerm}%'
            OR (source_id) ILIKE '%${searchTerm}%'
            OR (source_name) ILIKE '%${searchTerm}%'
            )
            AND published_at BETWEEN '${from}' AND '${to}'
             `;
    }


    const [rows] = await sequelize.query(query, { replacements: { searchTerm, from, to, endIndex, pageSize, offset } });

    const [countResults] = await sequelize.query(countQuery, { replacements: { searchTerm, from, to } });

    const totalCount = countResults[0].totalcount;
    
    //check back here
    if (rows.length > 0) {
      const totalPages = Math.ceil(totalCount / pageSize)

      console.log("llllll", totalCount, pageSize, totalPages);

      const pagination = { page, pageSize, totalPages, totalCount }
      console.log("Data found in the database");
      return { articles: rows, pagination }

    }

    else {
      console.log("No data found in the database");
      return { articles: [], pagination: {} };
    }

  }
  catch (error) {
    console.error("Error in searchArticles:", error);
    return { articles: [], pagination: {} };
  }
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