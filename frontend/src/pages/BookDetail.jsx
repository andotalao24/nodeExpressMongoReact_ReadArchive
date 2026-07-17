import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import "./BookDetail.css";

function BookDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [favMsg, setFavMsg] = useState("");
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    api.get(`/books/${id}`).then((data) => setBook(data)).catch((err) => setError(err.message)).finally(() => setLoading(false));
  }, [id]);

  const addToFavorites = async () => {
    setFavMsg("");
    try {
      await api.post("/users/favorites", { bookId: id });
      setFavMsg("Added to favorites!");
    } catch (err) {
      setFavMsg(err.message);
    }
  };

  const deleteEntry = async () => {
    if (!window.confirm("Delete this entry? This cannot be undone.")) return;
    try {
      await api.del(`/books/${id}`);
      navigate("/");
    } catch (err) {
      setFavMsg(err.message);
    }
  };

  if (loading) return <p className="detail-status">Loading...</p>;
  if (error) return <p className="detail-status detail-error">{error}</p>;
  if (!book) return <p className="detail-status">Book not found.</p>;

  const showImage = book.coverImage && !imgFailed;
  const isOwner = user && book.submittedBy && user._id === book.submittedBy._id;

  return (
    <div className="detail">
      <Link to="/" className="detail-back">Back to search</Link>
      <div className="detail-content">
        <div className="detail-cover">
          {showImage ? (
            <img src={book.coverImage} alt={book.title} onError={() => setImgFailed(true)} />
          ) : (
            <div className="detail-textcover">
              <span className="detail-textcover-title">{book.title}</span>
              <span className="detail-textcover-author">{book.author}</span>
            </div>
          )}
        </div>
        <div className="detail-info">
          <span className={`detail-type detail-type-${book.type}`}>{book.type}</span>
          <h1>{book.title}</h1>
          <p className="detail-author">by {book.author}</p>
          <p className="detail-description">{book.description}</p>

          {book.links && book.links.length > 0 && (
            <div className="detail-links">
              <h3>Resources</h3>
              {book.links.map((link) => (
                <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className="detail-link">{link.label}</a>
              ))}
            </div>
          )}

          {user ? (
            <div className="detail-actions">
              <button type="button" className="detail-fav-btn" onClick={addToFavorites}>Add to Favorites</button>
              {isOwner && (
                <button type="button" className="detail-delete-btn" onClick={deleteEntry}>Delete Entry</button>
              )}
            </div>
          ) : (
            <p className="detail-login-hint">
              <Link to="/login">Log in</Link> to save this to favorites.
            </p>
          )}
          {favMsg && <p className="detail-fav-msg">{favMsg}</p>}
        </div>
      </div>
    </div>
  );
}

export default BookDetail;