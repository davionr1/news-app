import { useState } from "react"
import { useEffect } from "react"
import './components.css'
const NewsItem = () => {
    let [articles, setArticles] = useState([])

    const ARTICLE_HEAD = "https://newsapi.org/v2/everything"
    const ARTICLE_MIDDLE = "&from=2023-05-26&sortBy=publishedAt&apiKey="
    const ARTICLE_KEY = "cf0514735ffd4bb0881e3afe2067dde4"
    const ARTICLE_SEARCH = "?q=USdebt&"

    // useEffect(() => {
    //     const fetchData = async () => {
    //         const response = await fetch(
    //             `https://newsapi.org/v2/everything?q=USdebt&sortBy=publishedAt&apiKey=cf0514735ffd4bb0881e3afe2067dde4`

    //         );
    //         const resData = await response.json();
    //         if (resData) {
    //             // console.log(resData)
    //             setNewsArticle([resData]);
    //             console.log('data', articles)
    //         } else {
    //             console.log("ERROR");
    //         }
    //     };
    //     fetchData();
    // }, []
    // )
    useEffect(() => {
        // Fetch data from API
        console.log(import.meta.env.VITE_KEY)
        const api_key = import.meta.env.VITE_KEY
        fetch(`https://newsapi.org/v2/top-headlines?q=tesla&sortBy=publishedAt&apiKey=${api_key}`)
          .then(response => response.json())
          .then(data => setArticles(data.articles))
          .catch(error => console.error(error));
      }, []);

console.log(articles)
    if (Array.isArray(articles)) {
        
        return (
            <div>
              <h1>News Articles about US Debt:</h1>
              <ul>
                {articles.map((article, index) => (
                  <li key={index}>
                    <h2>{article.title}</h2>
                    
                    <p>{article.description}</p>
                    <br></br>
                    <p>{article.content}</p>
                    <a href={article.url} target="_blank" rel="noopener noreferrer">
                      Read More
                    </a>
                    <hr />
                  </li>
                ))}
              </ul>
            </div>
          );

        return (
            <div className="article-container">
                
                
                {/* <h1>{newsArticle[0].articles[0].author}</h1>
                <h1>{newsArticle[0].articles[0].title}</h1>
                <h1> {newsArticle[0].articles[0].content}</h1>
                <h1>{newsArticle[0].articles[0].description}</h1>
                <h1>{newsArticle[0].articles[0].publishedAt}</h1>
                <h1>{newsArticle[0].articles[0].source.name}</h1>
                <h1>{newsArticle[0].articles[0].url}</h1>
                <h1>{newsArticle[0].articles[0].author}</h1>
                <img src={newsArticle[0].articles[0].urlToImage} /> */}
                {/* <h1>{newsArticle[0].articles[0]}</h1> */}
            </div>
        )
    }
}

export default NewsItem