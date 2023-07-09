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
            const response = await fetch(`https://newsapi.org/v2/top-headlines?q=${encodeURIComponent(articleSearch)}&sortBy=publishedAt&apiKey=${api_key}`)
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
    // const response = await fetch(`https://newsapi.org/v2/top-headlines?q=${encodeURIComponent(articleSearch)}&sortBy=publishedAt&apiKey=${api_key}`)

    // const createData = await fetch(`http://localhost:4000/makeArticles?query=${encodeURIComponent(articleSearch)}&url=${encodeURIComponent(response)}`)
    const getArticlesFromDB = async () => {
        try {
            const response = await fetch(`http://localhost:4000/search?query=${articleSearch}`);
            const data = await response.json()
            setArticleData(data)
            console.log("data", response);
        } catch (error) {
            console.log("couldnt retrieve data");
            getSearchResults()
        }
    }

    // useEffect(() => {
    //     const fetchData = async () => {
    //         const ifDataExistsInDB = true;
    //         if (ifDataExistsInDB) {
    //             await getArticlesFromDB()
    //             console.log("this func works");
    //         }
    //         else {
    //             getSearchResults()
    //             console.log("get search, else statement works");
    //         }
    //     }
    //     fetchData()

    // }, [])

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
                    {/* <input className='submit' type='submit' onClick={handleSearch}/> */}
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