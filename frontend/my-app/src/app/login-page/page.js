'use client';
import axios from "axios";
import { useState } from "react";
import React from "react";
import '../styles.css';
import { useRouter } from "next/navigation";
import { useAuth } from "../provider/authProvider";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState(null);
  const { login } = useAuth(); // Use login function

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 
    setSuccess(false);

    console.log("🟢 Sending login request with:", formData);
  
    try {
      const response = await axios.post("http://localhost:8000/login", formData);

      console.log("🟢 Server Response:", response.data);
  
      if (response.data.token && response.data.username) {
        login(response.data.token, response.data.username); // ✅ Set token using `login()`
        console.log("Login successful!", response.data.token);

        // ✅ Store token
        localStorage.setItem("token", response.data.token);
        // ✅ Verify storage immediately
        console.log("📦 Token stored:", localStorage.getItem("token"));

        setSuccess(true);
        await router.push("/dashboard");
      }
    } catch (error) {
      //console.error("Error response:", error.response?.data || error.message);
      setError(error.response?.data?.error || "Login failed");
    }
  };

  return (
    <div
      style={{
        position: "relative",
        zIndex: 1,
        textAlign: "center",
        marginTop: "50px",
      }}
    >
      <h1>Please Log In:</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>Login successful!</p>}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* <fieldset> */}
        {/* <label>
            <p>Username</p>
            <input type="text" name="username" value={formData.username} onChange={handleChange} required />
          </label>
          <label>
            <p>Password</p>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </label> */}
        <TextField
          required
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          required
          label="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          margin="normal"
        />
        {/* </fieldset> */}
        <Button variant="contained" type="submit">
          Submit
        </Button>
      </form>
      {token && <p>Token: {token}</p>}
    </div>
  );
}

export default LoginPage;
