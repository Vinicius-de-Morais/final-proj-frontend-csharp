import React, { useState } from "react";
import connection from "../Connection";
import { useNavigate } from "react-router-dom";


const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
        
      var name = "teste"; 
      const response = await connection.post("/api/login", {
        username,
        password,
        name,
      });

      if (response.status === 200) {
        // Login successful, perform any desired actions
        console.log("Login successful");
        navigate("/home", {replace: true})        
      } else {
        // Handle login error
        console.error("Login failed");
      }
    } catch (error) {
      console.error("An error occurred during login:", error);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="button" onClick={handleLogin}>
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginScreen;