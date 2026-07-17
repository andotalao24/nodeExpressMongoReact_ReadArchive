import { useState, useEffect } from "react";
import { api } from "../api/client";
import BookCard from "../components/BookCard";
import { useAuth } from "../context/AuthContext";
import "./Favorites.css";

function Favorites() {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    api
      .get("/users/favorites")
      .then((data) => setBooks(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user)
    return <p className="fav-status">Please log in to view your favorites.</p>;
  if (loading) return <p className="fav-status">Loading...</p>;
  if (error) return <p className="fav-status fav-error">{error}</p>;

  return (
    <div className="fav">
      <h1 className="fav-title">My Favorites</h1>
      {books.length === 0 ? (
        <p className="fav-status">
          No favorites yet. Browse books and add some!
        </p>
      ) : (
        <div className="fav-grid">
          {books.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;