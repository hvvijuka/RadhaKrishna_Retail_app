import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./LoginPage";
import CategoryImageUploader from "./CategoryImageUploader";
import CategoryImageViewer from "./CategoryImageViewer";
import AdminDashboard from "./components/AdminDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/upload" element={<CategoryImageUploader />} />
        <Route path="/view" element={<CategoryImageViewer />} />
      </Routes>
    </Router>
  );
}

export default App;