import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!username) {
      alert("Please enter a username");
      return;
    }

    if (username.toLowerCase() === "admin") {
      navigate("/upload"); // Admin goes to CategoryImageUploader
    } else {
      navigate("/view"); // Any other user goes to CategoryImageViewer
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Patanjali-Koramangala</h1>

      <div style={{ marginTop: "30px" }}>
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ padding: "10px", width: "250px", marginBottom: "10px" }}
        />
        <br />
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: "10px", width: "250px" }}
        />
        <br />
        <button
          onClick={handleLogin}
          style={{
            marginTop: "20px",
            padding: "10px 30px",
            borderRadius: "5px",
            border: "none",
            backgroundColor: "#4CAF50",
            color: "white",
            cursor: "pointer",
          }}
        >
          Login
        </button>
      </div>

      <div style={{ marginTop: "20px", color: "#888" }}>
        <p>Username "admin" goes to Admin Page (CategoryImageUploader)</p>
        <p>Any other username goes to User Page (CategoryImageViewer)</p>
      </div>
    </div>
  );
}

export default LoginPage;