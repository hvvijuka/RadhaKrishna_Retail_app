// ✅ server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";

// -------------------------
// 1️⃣ Load environment variables
// -------------------------
dotenv.config();

// Debug: print Cloudinary credentials (safe version)
console.log("=== Cloudinary ENV Check ===");
console.log("Cloud name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API key:", process.env.CLOUDINARY_API_KEY);
console.log("API secret:", process.env.CLOUDINARY_API_SECRET ? "Secret Loaded" : "Missing Secret");
console.log("============================");

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error("❌ Missing Cloudinary credentials in .env");
  process.exit(1);
}

// -------------------------
// 2️⃣ Configure Cloudinary
// -------------------------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// -------------------------
// 3️⃣ Initialize Express
// -------------------------
const app = express();
app.use(cors());
app.use(express.json());

console.log("✅ Cloudinary Configured:", process.env.CLOUDINARY_CLOUD_NAME);

// -------------------------
// 4️⃣ Helper: Fetch images by folder
// -------------------------
async function getImagesFromFolder(folder) {
  try {
    const result = await cloudinary.search
      .expression(`folder:${folder}`)
      .max_results(30)
      .execute();

    // Convert Cloudinary data to your frontend’s expected format
    return result.resources.map((file) => ({
      name: file.public_id.split("/").pop(), // file name without folder
      price: "", // placeholder
      description: "",
      cloudinaryUrl: file.secure_url,
    }));
  } catch (err) {
    console.error(`❌ Error fetching from folder ${folder}:`, err);
    return [];
  }
}

// -------------------------
// 5️⃣ API Route
// -------------------------
app.get("/api/getImages", async (req, res) => {
  try {
    const categories = {
      Category1: await getImagesFromFolder("Category1"),
      Category2: await getImagesFromFolder("Category2"),
      Category3: await getImagesFromFolder("Category3"),
    };
    res.json(categories);
  } catch (err) {
    console.error("❌ Error fetching images:", err);
    res.status(500).json({ error: "Failed to fetch images" });
  }
});

// -------------------------
// 6️⃣ Start server
// -------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
