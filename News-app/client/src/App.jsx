import { useState } from 'react'
import { useEffect } from 'react';
import Header from './components/header';
import SearchArticle from './components/searchArticle';
import NewsItem from './components/newsItem';
import './App.css'


function App() {
  let [newsArticle, setNewsArticle] = useState([])
  return (
    <>
      <div>
        <body>
          <Header />
          <SearchArticle />
          <NewsItem />
        </body>
      </div>
    </>
  )
}

export default App
