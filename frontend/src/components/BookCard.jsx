import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "./BookCard.css";

// Pick a consistent color based on the title so each book gets a stable shade
function colorFromTitle(title) {
  const colors = [
    "#4f46e5",
    "#0891b2",
    "#be123c",
    "#15803d",
    "#b45309",
    "#7c3aed",
    "#0f766e",
    "#a21caf",
  ];
  let sum = 0;
  for (let i = 0; i < title.length; i++) sum += title.charCodeAt(i);
  return colors[sum % colors.length];
}

function BookCard({ book }) {
  return (
    <Link to={`/books/${book._id}`} className="book-card">
      <div className="book-card-cover">
        {book.coverImage ? (
          <img src={book.coverImage} alt={book.title} />
        ) : (
          <div
            className="book-card-textcover"
            style={{ background: colorFromTitle(book.title) }}
          >
            <span className="book-card-textcover-title">{book.title}</span>
            <span className="book-card-textcover-author">{book.author}</span>
          </div>
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