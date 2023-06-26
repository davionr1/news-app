import './components.css'


//fix cond statement for author
const NewsItem = ({ article }) => {
  if (!article){
    return null
  }

  return (
    <div className="news-container">
      <h2>{article.title}</h2>
      <p>{article.description}</p>
      
      <p>{article.publishedAt}</p>
      <p>{article.source.name}</p>
      <a href={article.url} target="_blank" rel="noopener noreferrer">read more</a>
      
      
      
      <hr/>
    </div>
  );

}


export default NewsItem