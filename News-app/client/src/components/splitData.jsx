
export const splitData = async (newData) => {
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