import React, { useState } from "react";

function ImageUploader() {
  const [items, setItems] = useState([]); // Each item = {image, preview, name, price, description}

  // Handle file selection
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const newItems = files.map((file) => ({
      image: file,
      preview: URL.createObjectURL(file),
      name: "",
      price: "",
      description: "",
    }));
    setItems((prev) => [...prev, ...newItems]);
  };

  // Handle input change for name, price, description
  const handleInputChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  // Mock upload
  const handleUpload = () => {
    if (items.length === 0) {
      alert("Please select at least one image!");
      return;
    }
    console.log("Uploading items:", items);
    alert("Images and details uploaded successfully (mock)");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px", padding: "10px" }}>
      <h2>Upload Product Images & Details</h2>

      <input type="file" accept="image/*" multiple onChange={handleFileChange} />

      {/* Image grid container */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          maxWidth: "1100px",
          margin: "30px auto",
          gap: "20px",
          justifyContent: "center",
        }}
      >
        {items.map((item, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "15px",
              backgroundColor: "#f9f9f9",
              textAlign: "left",
            }}
          >
            <img
              src={item.preview}
              alt="Preview"
              style={{
                width: "100%",
                borderRadius: "10px",
                marginBottom: "10px",
              }}
            />

            <label>
              <b>Name:</b>
              <input
                type="text"
                value={item.name}
                onChange={(e) =>
                  handleInputChange(index, "name", e.target.value)
                }
                style={{
                  width: "100%",
                  marginTop: "5px",
                  padding: "5px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
            </label>
            <br />

            <label>
              <b>Price:</b>
              <input
                type="number"
                value={item.price}
                onChange={(e) =>
                  handleInputChange(index, "price", e.target.value)
                }
                style={{
                  width: "100%",
                  marginTop: "5px",
                  padding: "5px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
            </label>
            <br />

            <label>
              <b>Description:</b>
              <textarea
                value={item.description}
                onChange={(e) =>
                  handleInputChange(index, "description", e.target.value)
                }
                rows="3"
                style={{
                  width: "100%",
                  marginTop: "5px",
                  padding: "5px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
            </label>
          </div>
        ))}
      </div>

      <button
        onClick={handleUpload}
        style={{
          marginTop: "10px",
          padding: "10px 20px",
          borderRadius: "8px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Upload All
      </button>
    </div>
  );
}

export default ImageUploader;