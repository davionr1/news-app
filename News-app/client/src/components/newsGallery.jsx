const articleGallery = ()=>{


if (Array.isArray(articles)) {

    return (
      <div>
        <h1>News Articles about {api_search}:</h1>
        <ul>
          {/* maps through array of articles. 
                Article represents current item being processed.
                Index represents the index of the current item in the array*/}
          {articles.map((article, index) => (
            <li key={index}>
              <h2>{article.title}</h2>

              <p>{article.description}</p>
              <br></br>
              <p>{article.content}</p>
              {/* the underscore in target="_blank is to open a new tab " */}
              {/* noopener makes it where the new tab should not have access to the window.opener property of the og page. 
                    And norefferer prevents the linked site to know the source of the traffic */}
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                Read More
              </a>

              <hr />
            </li>
          ))}
        </ul>
      </div>
    );

  }
  return(
  <div>
    {articleGallery}
  </div>
  )
}
export default articleGallery