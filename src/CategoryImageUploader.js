import React, { useState, useEffect } from "react";
import axios from "axios";

function CategoryImageUploader() {
  const [categories, setCategories] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const CLOUD_NAME = "dqdkd2crn";
  const UPLOAD_PRESET = "radha-kanna-retail-app";

  // Load saved categories from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("categoriesData") || "{}");
    if (saved && Object.keys(saved).length) setCategories(saved);
  }, []);

  // Set first category as selected
  useEffect(() => {
    const firstCategory = Object.keys(categories)[0];
    if (firstCategory && !selectedCategory) setSelectedCategory(firstCategory);
  }, [categories, selectedCategory]);

  // Add or select a category
  const handleAddCategory = () => {
    const category = newCategory.trim();
    if (!category) return alert("Please enter a valid category name!");
    if (!categories[category]) {
      const updated = { ...categories, [category]: [] };
      setCategories(updated);
      savePersistentCategories(updated);
    }
    setSelectedCategory(category);
    setNewCategory("");
  };

  // Handle image selection
  const handleFileChange = (e) => {
    if (!selectedCategory) return alert("Select or create a category first!");
    const files = Array.from(e.target.files);

    const newItems = files.map((file) => ({
      image: file,
      name: "",
      price: "",
      description: "",
      public_id: null,
      imageURL: null,
    }));

    const updated = {
      ...categories,
      [selectedCategory]: [...(categories[selectedCategory] || []), ...newItems],
    };
    setCategories(updated);
  };

  // Handle text field updates
  const handleInputChange = (category, index, field, value) => {
    const updatedItems = [...(categories[category] || [])];
    updatedItems[index][field] = value;
    const updated = { ...categories, [category]: updatedItems };
    setCategories(updated);
    savePersistentCategories(updated);
  };

  // Delete image
  const handleDeleteImage = (category, index) => {
    const updatedItems = [...(categories[category] || [])];
    updatedItems.splice(index, 1);
    const updated = { ...categories, [category]: updatedItems };
    setCategories(updated);
    savePersistentCategories(updated);
    if (selectedImage === `${category}-${index}`) setSelectedImage(null);
  };

  // Move image to another category
  const handleMoveImage = (fromCategory, index, toCategory) => {
    if (!toCategory || toCategory === fromCategory) return;
    const fromItems = [...(categories[fromCategory] || [])];
    const [movedItem] = fromItems.splice(index, 1);
    const toItems = [...(categories[toCategory] || []), movedItem];
    const updated = {
      ...categories,
      [fromCategory]: fromItems,
      [toCategory]: toItems,
    };
    setCategories(updated);
    savePersistentCategories(updated);
    setSelectedImage(null);
  };

  // Save only persistent fields to localStorage
  const savePersistentCategories = (cats) => {
    const persistent = {};
    for (const [cat, items] of Object.entries(cats)) {
      persistent[cat] = items.map((item) => ({
        name: item.name,
        price: item.price,
        description: item.description,
        public_id: item.public_id,
        imageURL: item.imageURL,
      }));
    }
    localStorage.setItem("categoriesData", JSON.stringify(persistent));
  };

  // Upload images to Cloudinary
  const handleUpload = async () => {
    try {
      const updatedCategories = { ...categories };

      for (const [category, items] of Object.entries(updatedCategories)) {
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (!item.image || item.public_id) continue;

          const formData = new FormData();
          formData.append("file", item.image);
          formData.append("upload_preset", UPLOAD_PRESET);
          formData.append("folder", `products/${category}`);

          const res = await axios.post(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
            formData
          );

          items[i] = {
            ...item,
            imageURL: res.data.secure_url,
            public_id: res.data.public_id,
          };
        }
      }

      setCategories(updatedCategories);
      savePersistentCategories(updatedCategories);
      alert("✅ Upload completed successfully!");
    } catch (err) {
      console.error("Upload failed:", err);
      alert("❌ Upload failed. Check console.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px", padding: "10px" }}>
      <h2>📸 Category-based Product Image Uploader</h2>

      {/* Category Input */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Enter new category name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          style={{
            padding: "8px",
            width: "220px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            marginRight: "10px",
          }}
        />
        <button
          onClick={handleAddCategory}
          style={{
            padding: "8px 14px",
            borderRadius: "6px",
            backgroundColor: "#007BFF",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          ➕ Add / Select Category
        </button>
      </div>

      {/* Category Selector */}
      {Object.keys(categories).length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <b>Select Category:</b>{" "}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ padding: "6px", borderRadius: "6px", border: "1px solid #ccc", marginLeft: "5px" }}
          >
            <option value="">-- Choose --</option>
            {Object.keys(categories).map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      )}

      {/* File Upload */}
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        style={{ marginBottom: "20px" }}
      />

      {/* Category Display */}
      {Object.entries(categories).map(([category, items]) => (
        <div
          key={category}
          style={{
            marginTop: "30px",
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            backgroundColor: "#fdfdfd",
          }}
        >
          <h3 style={{ textAlign: "left", color: "#444" }}>
            🗂️ Category: <span style={{ color: "#007BFF" }}>{category}</span>
          </h3>

          {items.length === 0 ? (
            <p style={{ color: "#888" }}>No images uploaded yet.</p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "20px",
                marginTop: "15px",
              }}
            >
              {items.map((item, index) => {
                const imageKey = `${category}-${index}`;
                const isSelected = selectedImage === imageKey;

                return (
                  <div
                    key={index}
                    onClick={() => setSelectedImage(isSelected ? null : imageKey)}
                    style={{
                      border: isSelected ? "3px solid #28a745" : "1px solid #ccc",
                      borderRadius: "10px",
                      padding: "10px",
                      backgroundColor: "#fafafa",
                      cursor: "pointer",
                    }}
                  >
                    <img
                      src={item.imageURL || (item.image ? URL.createObjectURL(item.image) : "")}
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
                          handleInputChange(category, index, "name", e.target.value)
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

                    <label>
                      <b>Price:</b>
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) =>
                          handleInputChange(category, index, "price", e.target.value)
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

                    <label>
                      <b>Description:</b>
                      <textarea
                        value={item.description}
                        onChange={(e) =>
                          handleInputChange(category, index, "description", e.target.value)
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

                    {/* Show buttons only if image is selected */}
                    {isSelected && (
                      <div style={{ marginTop: "10px", display: "flex", gap: "8px" }}>
                        {/* Delete button */}
                        <button
                          onClick={() => handleDeleteImage(category, index)}
                          style={{
                            flex: 1,
                            padding: "6px",
                            backgroundColor: "#dc3545",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                          }}
                        >
                          🗑️ Delete
                        </button>

                        {/* Single Move button */}
                        <button
                          onClick={() => {
                            const availableCategories = Object.keys(categories).filter(
                              (cat) => cat !== category
                            );
                            if (availableCategories.length === 0)
                              return alert("No other category available!");
                            const target = prompt(
                              "Enter target category to move this image:\nAvailable: " +
                                availableCategories.join(", ")
                            );
                            if (!target || !availableCategories.includes(target)) return;
                            handleMoveImage(category, index, target);
                          }}
                          style={{
                            flex: 1,
                            padding: "6px",
                            backgroundColor: "#007BFF",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                          }}
                        >
                          Move
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}

      <button
        onClick={handleUpload}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          borderRadius: "8px",
          backgroundColor: "#28a745",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        🚀 Upload All Categories
      </button>
    </div>
  );
}

export default CategoryImageUploader;
