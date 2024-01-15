import './components.css'
import { useEffect, useState } from 'react';
import NewsItem from './newsItem';
import './calendar.css'
import { GetDifferenceOfNewEntries } from './getDifferenceOfNewEntries';
import { splitData } from './splitData'

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
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPage, setTotalPage] = useState(1)
    const [formSubmitted, setFormSubmitted] = useState(false)
    const pageSize = 5

    const sort = ['publishedAt', 'relevancy', 'popularity']
    const endpoint = ['top-headlines', 'everything']
    const defaultValueEndpoint = 'top-headlines'
    const defaultValueSortBy = 'publishedAt'
    //look into this
    const lastPostIndex = currentPage * pageSize;
    const firstPostIndex = lastPostIndex - pageSize;


    const getSearchResults = async () => {
        //retrieve api data from user input
        const apiResponse = await fetch(
            `https://newsapi.org/v2/${searchEndpoint ? `${searchEndpoint}` : `${defaultValueEndpoint}`}?q=${(articleSearch)}&sortBy=${sortBy ? `${sortBy}` : `${defaultValueSortBy}`}&apiKey=${api_key}${firstDate && secondDate ? `&from=${firstDate}&to=${secondDate}` : ''}`);
        const apiData = await apiResponse.json()

        const DBresponse = await fetch(`http://localhost:4000/search?q=${articleSearch}${firstDate && secondDate ? `&fromDate=${firstDate}` : ''} ${firstDate && secondDate ? `&toDate=${secondDate}` : ''}&page=${currentPage}&pageSize=${pageSize}`);
        const DBdata = await DBresponse.json();
        const DBresponseAll = await fetch(`http://localhost:4000/search?q=${articleSearch}&page=${currentPage}&pageSize=${pageSize}`);
        const DBdataAll = await DBresponseAll.json();

        renderStates(firstDate, secondDate, DBdata, DBdataAll, articleSearch)
        //call a function in the dbdata conditional statement for a function that sets data to jsx without apidata or newdata
        const newData = GetDifferenceOfNewEntries(DBdataAll, apiData)

        console.log("db", DBdata);
        console.log("dbAll", DBdataAll);
        console.log("api", apiData);
        console.log("the dif", newData);

        //if theres no data in db
        if (!DBdataAll || DBdataAll.length === 0) {

            try {
                console.log("make data if not data in db");
                if (searchEndpoint || defaultValueEndpoint !== "everything") {
                    //triggers a query to add data in db then set data from api data
                    const makeData = await fetch(`http://localhost:4000/makeArticles?q=${encodeURIComponent(articleSearch)}`)
                }
                setArticleData(apiData.articles || [])
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
                setArticleData(DBdataAll)
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
    }
    //outputs on the screen the combined data of the db and new data


    const renderStates = async (firstDate, secondDate, DBdata, DBdataAll, articleSearch) => {
        console.log("test", DBdataAll, DBdataAll.totalPage);
        if (firstDate && secondDate) {
            setArticleData(DBdata)
            // setTotalPage(DBdata.totalPage || 0)
            setSearchedArticle(articleSearch)
        }
        else {
            setArticleData(DBdataAll);
            // setTotalPage(DBdataAll.totalPage || 0)
            setSearchedArticle(articleSearch)
        }
    }

    const handleSearch = (e) => {
        e.preventDefault();
        if (articleSearch) {
            setFormSubmitted(true)
            getSearchResults()
        }
    }
    const handleEndpoint = (e) => {
        setSearchEndpoint(e.target.value)
    }

    const handleSortBy = (e) => {
        setSortBy(e.target.value)
    }

    const handleFormatInput = (e) => {
        setSecondDate(e.target.value)
    }

    useEffect(() => {
        try {
            if (setFormSubmitted) {
                checkDateInput()
                setSearchedArticle(articleSearch)
                setFormSubmitted(false)
                renderStates()
            }
        }
        catch (error) {
            console.log(error);
        }
    }, [searchedArticle, currentPage])

    const checkDateInput = () => {
        const dateFormatPattern = /^(198[0-9]|199[0-9]|200[0-9]|201[0-9]|202[0-4])[-](0[1-9]|[1][0-2])[-](0[1-9]|[12][0-9]|3[01])\s?$/
        const validFirstPattern = dateFormatPattern.test(firstDate)
        const validSecondPattern = dateFormatPattern.test(secondDate)

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
        dateFormatPattern.test(secondDate)
    }

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
                {searchedArticle && (
                    <footer>
                        <div className='navigation'>
                            <button onClick={() => setCurrentPage(currentPage - 1)} {...window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })} disabled={currentPage === 1}>
                                Prev
                            </button>
                            <div className='page'>{`Page ${currentPage} of ${totalPage}`}</div>
                            <button onClick={() => setCurrentPage(currentPage + 1)} {...window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })} disabled={currentPage === totalPage}>
                                Next
                            </button>
                        </div>
                    </footer>
                )}
            </div>
        </>
    )
}
export default SearchArticle
