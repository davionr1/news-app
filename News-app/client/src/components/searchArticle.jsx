import './components.css'
import { useState } from 'react';
import NewsItem from './newsItem';

const SearchArticle = () => {

    const [articleData, setArticleData] = useState([]);
    const [articleSearch, setArticleSearch] = useState('');
    const [searchedArticle, setSearchedArticle] = useState('')
    const api_key = import.meta.env.VITE_KEY


    const getSearchResults = async () => {
        //check to see if data is in db
        try {
            const DBresponse = await fetch(`http://localhost:4000/search?query=${articleSearch}`);
            if (DBresponse.ok) {
                const DBdata = await DBresponse.json();

                if (DBdata.length > 0) {

                    console.log("data retrieved from backend", DBdata);
                    setArticleData(DBdata)
                    setSearchedArticle(articleSearch)


                }
                
            }

            //else retrieve from api data
        }

        catch {
            const apiResponse = await fetch(`https://newsapi.org/v2/top-headlines?q=${(articleSearch)}&sortBy=publishedAt&apiKey=${api_key}`)
            const apiData = await apiResponse.json()

            setArticleData(apiData.articles)

            console.log("retrieved from api data", apiData.articles);

            setSearchedArticle(articleSearch)

            const createData = await fetch(`http://localhost:4000/makeArticles?q=${encodeURIComponent(articleSearch)}`)
            const backend = await createData.json()
            console.log("backend", backend);
        }
    }

    const handleSearch = (e) => {
        e.preventDefault();
        if (articleSearch) {
            getSearchResults()

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