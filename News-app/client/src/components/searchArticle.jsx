import './components.css'
import { useState } from 'react';
import NewsItem from './newsItem';

const SearchArticle = () => {

    const [articleData, setArticleData] = useState([]);
    const [articleSearch, setArticleSearch] = useState('');
    const [searchedArticle, setSearchedArticle] = useState('')
    const api_key = import.meta.env.VITE_KEY

    const getSearchResults = async () => {
        try {
            const response = await fetch(`https://newsapi.org/v2/top-headlines?q=${(articleSearch)}&sortBy=publishedAt&apiKey=${api_key}`)
            const data = await response.json()
            setArticleData(data.articles)
            console.log("frontend", data.articles);
            setSearchedArticle(articleSearch)
            const createData = await fetch(`http://localhost:4000/makeArticles?q=${encodeURIComponent(articleSearch)}`)
            const backend = await createData.json()
            console.log("backend", backend);
        }
        catch (error) {
            console.log("error fetching data", error);
        }
    }

    const getArticlesFromDB = async () => {
        try {
            const response = await fetch(`http://localhost:4000/search?query=${articleSearch}`);

            const data = await response.json();

            if (data === null) {
                getSearchResults()
                console.log("No data retrieved from the database");
            } else {
                setArticleData(data);
                setSearchedArticle(articleSearch)
                console.log("Data retrieved successfully", data);
            }
        } catch {
            console.log("Error retrieving data from the server:");
            getSearchResults();
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (articleSearch) {
            getArticlesFromDB()

        }
    }

    return (
        <div className="search-container">
            <form onSubmit={handleSearch}>
                <div className="search-input">
                    <input
                        type="text"
                        value={articleSearch}
                        onChange={(e) => setArticleSearch(e.target.value)}
                        placeholder="Search for news"
                    />
                    <input type='submit' className="submit" onSubmit={handleSearch} />
                </div>
            </form>

            {searchedArticle && (
                <div className="news-identifier">Searches for <b>{searchedArticle}</b>
                    <hr></hr>
                    <div className="article-list">
                        {articleData.map((article) => (
                            <>
                                <NewsItem key={article.id} article={article} />
                            </>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )

}
export default SearchArticle