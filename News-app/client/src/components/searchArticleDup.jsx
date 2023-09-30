import './components.css'
import { useState } from 'react';
import NewsItem from './newsItem';
import Calendar from 'react-calendar';
import './calendar.css'
import dayjs from 'dayjs'
import { isSameDay } from 'dayjs';
const api_key = import.meta.env.VITE_KEY

const SearchArticle = ({classes}) => {

    const [articleData, setArticleData] = useState([]);
    const [articleSearch, setArticleSearch] = useState('');
    const [searchedArticle, setSearchedArticle] = useState('')
    const [sortBy, setSortBy] = useState('')
    const [searchEndpoint, setSearchEndpoint] = useState('')
    const [dates, setDates] = useState([])

    const sort = ['publishedAt', 'relevancy', 'popularity']
    const endpoint = ['top-headlines', 'everything']
    const defaultValueEndpoint = 'top-headlines'
    const defaultValueSortBy = 'publishedAt'

    //set up the data shown to user as most recent to not

    const getSearchResults = async () => {
        //check to see if data is in db
        //for the from and to part of the url change 
        const apiResponse = await fetch(
            `https://newsapi.org/v2/${searchEndpoint ? `${searchEndpoint}` : `${defaultValueEndpoint}`}?q=${(articleSearch)}&sortBy=${sortBy ? `${sortBy}` : `${defaultValueSortBy}`}&apiKey=${api_key}${minDate ? `&from=${minDate}` : ''} ${maxDate ? `&to=${maxDate}` : ''}`)
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

    const onClickDay = (date) =>{
        const dateAlreadyClicked = dates.some((setDate)=>{
            isSameDay(setDates, date)
        })
        if (!dateAlreadyClicked){
            setDates([...dates, date]);
        }
        else{
            const updatedDates = dates.filter((selectedDate)=>{
                !isSameDay(dates, date)
            })
            setDates(updatedDates)
        }
    }
    const isSameDay = (date, setDates) =>{
        const notSameDay = !dates.some((date)=>{
            return notSameDay
        })
    }
    const tileClassName = ({date}) => {
            const classNames = [classes]
            // give active days a special class
            if (dateAlreadyClicked(dates, date)) return [classes.activeDay, ...classNames]
            return classNames
          
        
    }

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



                {/* adjust this calendar form code */}
                <div className="calender-container">
                    <h2>Select two dates to range from</h2>
                    <Calendar onClickDay={onClickDay} value={dates} />
                </div>
                {dates.length > 0 ? (

                    <p >
                        {/* <span >Start:</span>{''} {dates[0].toDateString()}
                        &nbsp; to &nbsp;
                        <span>End:</span> {dates[1].toDateString()} */}
                    </p>
                ) : (
                    <p>
                        {/* <span>Selected date:</span>{''} {dates.toDateString()} */}
                    </p>

                )}
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

                            {articleData.map((article) => (
                                <><hr />
                                    <NewsItem key={article.id} article={article} />
                                </>
                            ))}
                        </div>
                    </div>
                )}
            </div>



        </>
    )

}
export default SearchArticle