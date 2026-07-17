import { useState, useEffect } from "react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import "./Collections.css";

function Collections() {
  const { user } = useAuth();
  const [collections, setCollections] = useState([]);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.get("/users/collections");
      setCollections(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    load();
  }, [user]);

  const createCollection = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      await api.post("/users/collections", { name: newName });
      setNewName("");
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteCollection = async (colId) => {
    try {
      await api.del(`/users/collections/${colId}`);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const renameCollection = async (colId) => {
    const name = prompt("New name for this collection:");
    if (!name) return;
    try {
      await api.put(`/users/collections/${colId}`, { name });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  if (!user)
    return <p className="col-status">Please log in to view your collections.</p>;
  if (loading) return <p className="col-status">Loading...</p>;

  return (
    <div className="col">
      <h1 className="col-title">My Collections</h1>

      <form className="col-form" onSubmit={createCollection}>
        <input
          type="text"
          placeholder="New collection name..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button type="submit">Create</button>
      </form>

      {error && <p className="col-error">{error}</p>}

      {collections.length === 0 ? (
        <p className="col-status">No collections yet. Create one above!</p>
      ) : (
        <div className="col-list">
          {collections.map((col) => (
            <div key={col._id} className="col-card">
              <div className="col-card-header">
                <h3>{col.name}</h3>
                <div className="col-card-actions">
                  <button type="button" onClick={() => renameCollection(col._id)}>
                    Rename
                  </button>
                  <button
                    type="button"
                    className="col-delete"
                    onClick={() => deleteCollection(col._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="col-count">{col.books.length} book(s)</p>
              <ul className="col-books">
                {col.books.map((book) => (
                  <li key={book._id}>{book.title}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Collections;