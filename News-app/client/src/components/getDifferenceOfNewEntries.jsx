
export const GetDifferenceOfNewEntries = (DBdataAll, apiData) => {
    console.log("tester", DBdataAll, apiData);
    //looks through db and api for data thats not in db and stores into newdata variable
    try {
        const existingTitles = DBdataAll.map((data) => data.title);
        const newData = apiData.articles.filter((article) => !existingTitles.includes(article.title));
        return newData;
    } catch (error) {
        console.error('Error filtering new entries:', error);
        return [];
    }
    }
