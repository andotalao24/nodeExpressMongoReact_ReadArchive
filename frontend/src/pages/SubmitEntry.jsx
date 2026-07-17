import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import "./SubmitEntry.css";

function SubmitEntry() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [type, setType] = useState("book");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [linkLabel, setLinkLabel] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [error, setError] = useState("");

  if (!user) {
    return <p className="submit-status">Please log in to submit an entry.</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const links = [];
      if (linkLabel && linkUrl) {
        links.push({ label: linkLabel, url: linkUrl });
      }
      const book = await api.post("/books", {
        title,
        author,
        type,
        description,
        coverImage,
        links,
      });
      navigate(`/books/${book._id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="submit">
      <h1 className="submit-title">Submit a New Entry</h1>
      <form className="submit-form" onSubmit={handleSubmit}>
        {error && <div className="submit-error">{error}</div>}

        <label htmlFor="title">Title *</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label htmlFor="author">Author</label>
        <input
          id="author"
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />

        <label htmlFor="type">Type *</label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="book">Book</option>
          <option value="article">Article</option>
        </select>

        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          rows="4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label htmlFor="coverImage">Cover Image URL (optional)</label>
        <input
          id="coverImage"
          type="url"
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
        />

        <label htmlFor="linkLabel">Resource Link Label (optional)</label>
        <input
          id="linkLabel"
          type="text"
          placeholder="e.g. Free PDF, Buy on Amazon"
          value={linkLabel}
          onChange={(e) => setLinkLabel(e.target.value)}
        />

        <label htmlFor="linkUrl">Resource Link URL (optional)</label>
        <input
          id="linkUrl"
          type="url"
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
        />

        <button type="submit">Submit Entry</button>
      </form>
    </div>
  );
}

export default SubmitEntry;