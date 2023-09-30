import './components.css'
import { useEffect, useState } from 'react';
import NewsItem from './newsItem';
import './calendar.css'

const api_key = import.meta.env.VITE_KEY

const SearchArticle = () => {

    const [articleData, setArticleData] = useState([]);
    const [articleSearch, setArticleSearch] = useState('');
    const [searchedArticle, setSearchedArticle] = useState('')
    const [sortBy, setSortBy] = useState('')
    const [searchEndpoint, setSearchEndpoint] = useState('')
    const [firstDate, setFirstDate] = useState('')
    const [secondDate, setSecondDate] = useState('')
    const [validFirstDate, setFirstValidDate] = useState(true)
    const [validSecondDate, setSecondValidDate] = useState(true)

    const sort = ['publishedAt', 'relevancy', 'popularity']
    const endpoint = ['top-headlines', 'everything']
    const defaultValueEndpoint = 'top-headlines'
    const defaultValueSortBy = 'publishedAt'

    const getSearchResults = async () => {
        //check to see if data is in db
        //for the from and to part of the url change 
        const apiResponse = await fetch(
            `https://newsapi.org/v2/${searchEndpoint ? `${searchEndpoint}` : `${defaultValueEndpoint}`}?q=${(articleSearch)}&sortBy=${sortBy ? `${sortBy}` : `${defaultValueSortBy}`}&apiKey=${api_key}${firstDate & secondDate ? `&from=${firstDate}` : ''} ${firstDate & secondDate ? `&to=${secondDate}` : ''}`)
        const apiData = await apiResponse.json()

        const DBresponse = await fetch(`http://localhost:4000/search?q=${articleSearch}`);
        const DBdata = await DBresponse.json();

        const newData = getDifferenceOfNewEntries(DBdata, apiData)

        console.log("db", DBdata);
        console.log("api", apiData);
        console.log("the dif", newData);

        //if theres no data in db
        if (!DBdata || DBdata.length === 0) {
            try {
                console.log("make data if not data in db");
                if (searchEndpoint || defaultValueEndpoint !== "everything") {
                    //triggers a query to add data in db then set data from api data
                    const makeData = await fetch(`http://localhost:4000/makeArticles?q=${encodeURIComponent(articleSearch)}`)
                }
                setArticleData(apiData.articles)
                setSearchedArticle(articleSearch)
            }
            //catch if theres an error, most likely an due to too much data moving to backend
            catch (error) {
                if (error.status === 431) {
                    try {
                        console.log("431 shown");
                        //split data to be able to move the data
                        splitData(newData)
                    }
                    catch (splitError) {
                        console.log("error in splitdata:");
                    }
                }
                setArticleData(DBdata)
                setSearchedArticle(articleSearch)
            }
        }
        else {
            try {
                //else, check to see if theres a difference between api and db data
                if (newData.length > 0 && searchEndpoint || defaultValueEndpoint !== "everything") {
                    //add the difference to db
                    const createData = await fetch(`http://localhost:4000/makeNewDataArticles?q=${encodeURIComponent(articleSearch)}&data=${encodeURIComponent(JSON.stringify(newData))}`)
                    console.log("added the new entries");
                }
                else {
                    console.log("outputtted from newdata else statement");
                }
            }
            catch (error) {
                console.log("error");
                if (error) {
                    console.log("process of splitting data");
                    splitData(newData)
                }
            }
        }
        console.log("last output");
        //outputs on the screen the combined data of the db and new data
        setArticleData([...DBdata, ...newData])
        setSearchedArticle(articleSearch)
    }

    const getDifferenceOfNewEntries = (DBdata, apiData) => {
        //looks through db and api for data thats not in db and stores into newdata variable
        try {
            const existingTitles = DBdata.map((data) => data.title);
            const newData = apiData.articles.filter((article) => !existingTitles.includes(article.title));
            return newData;
        } catch (error) {
            console.error('Error filtering new entries:', error);
            return [];
        }
    };

    const splitData = async (newData) => {
        //in case of 431 error, this func splits the data to one at a time store the data in the db
        try {
            const midPoint = newData.length / 2;
            const topHalf = newData.slice(0, midPoint);
            const bottomHalf = newData.slice(midPoint);

            const responseArray = await Promise.all([
                fetch(`http://localhost:4000/makeTopSplitArticles?topData=${encodeURIComponent(JSON.stringify(topHalf))}`),
                fetch(`http://localhost:4000/makeBottomSplitArticles?bottomData=${encodeURIComponent(JSON.stringify(bottomHalf))}`)
            ])
            return [topHalf, bottomHalf];
        } catch (error) {
            // Handle any other errors that may occur during the fetch operation
            console.error("Error while splitting data:", error.message);
            throw error; // Propagate the error to the caller, if necessary
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (articleSearch) {
            getSearchResults()
        }
    }
    const handleEndpoint = (e) => {
        setSearchEndpoint(e.target.value)
    }

    const handleSortBy = (e) => {
        setSortBy(e.target.value)
    }

    useEffect(() => {
        checkDateInput()
    }, [firstDate, secondDate])

    const handleFormatInput = (e) => {
        setSecondDate(e.target.value)

    }

    //use select range to store all the dates in a array then output first and last index
    const checkDateInput = () => {
        const dateFormatPattern = /^(198[0-9]|199[0-9]|200[0-9]|201[0-9]|202[0-4])[-](0[1-9]|[1][0-2])[-](0[1-9]|[12][0-9]|3[01])\s?$/
        const validFirstPattern = (console.log(dateFormatPattern.test(firstDate)))
        const validSecondPattern = (console.log(dateFormatPattern.test(secondDate)))

        console.log(firstDate, secondDate);

        if (validFirstPattern) {
            setFirstValidDate(true)
        }
        else {
            setFirstValidDate(false)
        }

        if (validSecondPattern) {
            setSecondValidDate(true)
        }
        else {
            setSecondValidDate(false)
        }

        console.log(dateFormatPattern.test(secondDate))
    };

 

    const sortedArticle = articleData.sort((a, b) => {
        const dateA = new Date(a.publishedAt || a.published_at || '')
        const dateB = new Date(b.publishedAt || b.published_at || '')
        return dateB - dateA;
    })
  
    return (
        <>
            <div className="search-container">
                <div className="endpoint-container">
                    <h2>Search by</h2>
                    <select value={searchEndpoint} onChange={handleEndpoint}>

                        {endpoint.map((point) => (
                            <option key={point} value={point}>
                                {point}
                            </option>
                        ))}
                        <option value='top-headlines'></option>
                    </select>
                </div>
                <div className="sortby-container">
                    <h2>sort by</h2>
                    <select value={sortBy} onChange={handleSortBy}>

                        {sort.map((getSort) => (
                            <option key={getSort} value={getSort}>
                                {getSort}
                            </option>
                        ))}
                        <option value='publishedAt'></option>
                    </select>
                </div>

                {/* create a route that gets data with specific dates in the situation that user puts in dates  */}
                <div className="calender-container">
                    <h2>Search two dates for your search - optional</h2>
                    <form>
                        <b>From</b>
                        <>
                            <div className="dateFirstBox">
                                <input type='text'
                                    value={firstDate}
                                    onChange={(e) => { setFirstDate(e.target.value) }}
                                    placeholder='0000/00/00'
                                />
                            </div>

                            {firstDate.length > 0 && firstDate.length !== 10 && !validFirstDate && (
                                <div className='notValidDate'>
                                    Date must be in format of: 2023-07-22
                                </div>
                            )
                            }
                        </>
                        <b>To</b>
                        <div className="dateSecondBox">
                            <input type='text'
                                value={secondDate}
                                onChange={handleFormatInput}
                                placeholder='0000/00/00'
                            />
                        </div>
                        {secondDate.length > 0 && secondDate.length !== 10 && !validSecondDate && (
                            <div className='notValidDate'>
                                Date must be in format of: 2023-07-27
                            </div>
                        )
                        }
                    </form>
                </div>

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
                        <div className="article-list">
                            <>
                            {sortedArticle.map((article) => (
                                <NewsItem key={article.id} article={article} />
                                ))}
                            </>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}
export default SearchArticle