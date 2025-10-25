
import React, { useState, useEffect } from "react";

const categories = ["category1", "category2", "category3"]; // your Cloudinary folders

function AdminDashboard() {
  const [username, setUsername] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [images, setImages] = useState({});

  const handleLogin = () => {
    if (username.trim() === "admin") {
      setLoggedIn(true);
    } else {
      alert("Only admin can view images.");
    }
  };

  const fetchImages = async () => {
    const tempImages = {};
    for (const category of categories) {
      try {
        const res = await fetch(`http://localhost:5000/images/${category}`);
        const data = await res.json();
        tempImages[category] = data;
      } catch (err) {
        console.error(`Error fetching ${category}:`, err);
        tempImages[category] = [];
      }
    }
    setImages(tempImages);
  };

  useEffect(() => {
    if (loggedIn) {
      fetchImages();
    }
  }, [loggedIn]);

  if (!loggedIn) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>Admin Login</h2>
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard - Images by Category</h1>
      {Object.keys(images).map((category) => (
        <div key={category} style={{ marginBottom: "40px" }}>
          <h2>{category}</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {images[category].map((img) => (
              <div key={img.public_id}>
                <img
                  src={img.secure_url}
                  alt={img.public_id}
                  style={{ width: "150px", height: "150px", objectFit: "cover" }}
                />
                <p style={{ fontSize: "12px" }}>ID: {img.public_id}</p>
                <p style={{ fontSize: "12px" }}>Format: {img.format}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default AdminDashboard;
