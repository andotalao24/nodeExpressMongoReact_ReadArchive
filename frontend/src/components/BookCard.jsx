import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "./BookCard.css";

function BookCard({ book }) {
  return (
    <Link to={`/books/${book._id}`} className="book-card">
      <div className="book-card-cover">
        {book.coverImage ? (
          <img src={book.coverImage} alt={book.title} />
        ) : (
          <div className="book-card-placeholder">{book.type}</div>
        )}
      </div>
      <div className="book-card-body">
        <span className={`book-card-type book-card-type-${book.type}`}>
          {book.type}
        </span>
        <h3 className="book-card-title">{book.title}</h3>
        <p className="book-card-author">{book.author}</p>
      </div>
    </Link>
  );
}

BookCard.propTypes = {
  book: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string,
    type: PropTypes.string,
    coverImage: PropTypes.string,
  }).isRequired,
};

export default BookCard;
