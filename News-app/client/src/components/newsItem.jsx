import './components.css'

const NewsItem = ({ article }) => {

  return (
    <div className="news-container">
        <>
          <hr />
          {article.author && <div>by {article.author}</div>}
          <h2>{article.title}</h2>
          <p>{article.description}</p>
          {article.content && <div>{article.content}</div>}
          {article.publishedAt && <p>{article.publishedAt}</p>}
          {article.published_at && <p>{article.published_at}</p>}
          {article.source_name && <p>{article.source_name}</p>}
          {article.source && article.source.name && <p>{article.source.name}</p>}
          <a href={article.url} target="_blank" rel="noopener noreferrer">read more</a>
        </>
    </div>
  );
}

export default NewsItem