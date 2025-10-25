import React, { useState, useEffect } from "react";

function CategoryImageViewer() {
  const [categories, setCategories] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("");
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const backendUrl = process.env.REACT_APP_BACKEND_URL;
        const res = await fetch(`${backendUrl}/api/getImages`);;
        const data = await res.json();

        console.log("Fetched categories:", data);
        setCategories(data || {});

        const firstCategory = Object.keys(data || {})[0];
        if (firstCategory) setSelectedCategory(firstCategory);
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const handleAddToCart = (category, index) => {
    const item = categories[category][index];
    setCart((prev) => [...prev, { ...item, category }]);
  };

  const categoryKeys = Object.keys(categories || {});

  if (loading) return <h3 style={{ textAlign: "center" }}>⏳ Loading images...</h3>;

  return (
    <div style={{ textAlign: "center", marginTop: 20, padding: 10 }}>
      <h2>🛍️ Category-wise Product Viewer</h2>

      {/* Category selector */}
      {categoryKeys.length > 0 ? (
        <div style={{ marginBottom: 20 }}>
          <label>
            <b>Select Category:</b>{" "}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                padding: 6,
                borderRadius: 6,
                border: "1px solid #ccc",
                marginLeft: 5,
              }}
            >
              {categoryKeys.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </label>
        </div>
      ) : (
        <p>No categories found.</p>
      )}

      {/* Image grid */}
      {selectedCategory &&
        Array.isArray(categories[selectedCategory]) &&
        categories[selectedCategory].length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 20,
              marginTop: 15,
            }}
          >
            {categories[selectedCategory].map((item, index) => (
              <div
                key={index}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: 10,
                  padding: 10,
                  backgroundColor: "#fafafa",
                  boxShadow:
                    "0 4px 8px rgba(0,0,0,0.2), 0 6px 20px rgba(0,0,0,0.1)",
                  textAlign: "left",
                }}
              >
                <img
                  src={item.cloudinaryUrl}
                  alt={item.name}
                  style={{
                    width: "100%",
                    height: 200,
                    objectFit: "cover",
                    borderRadius: 10,
                    marginBottom: 10,
                  }}
                />
                <p><b>Name:</b> {item.name}</p>
                <p><b>Price:</b> ₹{item.price || "-"}</p>
                <p><b>Description:</b> {item.description || "-"}</p>
                <button
                  onClick={() => handleAddToCart(selectedCategory, index)}
                  style={{
                    marginTop: 5,
                    padding: "6px 12px",
                    borderRadius: 5,
                    border: "none",
                    backgroundColor: "#28a745",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  ➕ Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}

      {/* Cart */}
      <div style={{ marginTop: 40, textAlign: "left", maxWidth: 600, margin: "40px auto" }}>
        <h3>🛒 Cart ({cart.length} items)</h3>
        {cart.length === 0 && <p>No items in cart.</p>}
        {cart.length > 0 && (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {cart.map((item, i) => (
              <li
                key={i}
                style={{
                  marginBottom: 10,
                  padding: 10,
                  border: "1px solid #ccc",
                  borderRadius: 5,
                  backgroundColor: "#f8f8f8",
                }}
              >
                <b>{item.name}</b> ({item.category}) – ₹{item.price || "-"}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default CategoryImageViewer;
