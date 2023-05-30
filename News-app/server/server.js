require('dotenv').config()
const axios = require("axios").default;
const express = require('express')
const app = express()
const cors = require('cors')

const {Sequelize} = require('sequelize')
const sequelize = new Sequelize(process.env.PG_URI)

// app.use(cors({
//     origin: 'http://localhost:3000',
//     credentials: true
//  }))

// const options = {
//     method: 'GET',
//     url: 'https://newsapi.org/v2/top-headlines?q=tesla&sortBy=publishedAt',
//     params: {q: '', lang: 'en', sort_by: 'relevancy', page: '1'},
//     headers: {
//       'x-api-key': process.env.API_KEY
//     }
//   };
  
  axios.request(options).then(function (response) {
      console.log(response.data);
  }).catch(function (error) {
      console.error(error);
  });

console.log(options);

app.use('/news', require('./controller/news'))
app.listen(process.env.PORT,()=>{
    console.log(` ${process.env.PORT}`);
})
