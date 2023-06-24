import './components.css'
import { useState, useEffect } from 'react';
import NewsItem from './newsItem';

const SearchArticle = () => {

    const [articleData, setArticleData] = useState([]);
    const [articleSearch, setArticleSearch] = useState('');
    const [searchedArticle, setSearchedArticle] = useState('')
    const api_key = import.meta.env.VITE_KEY

    const getSearchResults = async () => {
        try {
            const response = await fetch(`https://newsapi.org/v2/top-headlines?q=${articleSearch}&sortBy=publishedAt&apiKey=${api_key}`)
            const data = await response.json()
            setArticleData(data.articles)
            console.log(data.articles);
            setSearchedArticle(articleSearch)
        }
        catch (error) {
            console.log("error fetching data", error);
        }
    }

    const getArticlesFromDB = async () => {
        try {
            const response = await fetch('http://localhost:4000/articles')
            const data = await response.json()
            setArticleData(data)
        } catch (error) {
            console.log("couldnt retrieve data");
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            const ifDataExistsInDB = true;
            if (ifDataExistsInDB) {
                await getArticlesFromDB()
                console.log("this func works");
            }
            else {
                getSearchResults()
            }
        }
        fetchData()

    }, [])

    const handleSearch = () => {
        if (articleSearch) {
            getSearchResults()
        }
    }

    return (
        <div className="search-container">
            <div className="search-input">
                <input
                    type="text"
                    value={articleSearch}
                    onChange={(e) => setArticleSearch(e.target.value)}
                    placeholder="Search for news"
                />
                <input type='submit' onClick={handleSearch}></input>
            </div>
            {searchedArticle && ( // Conditional rendering based on searchedArticle state
                <div className="news-identifier">Searches for {searchedArticle}
                <hr></hr>
                    <div className="article-list">
                        {articleData.map((article) => (
                            <NewsItem key={article.id} article={article} />

                        ))}

                    </div>
                </div>
            )}
        </div>
    )

}
export default SearchArticle