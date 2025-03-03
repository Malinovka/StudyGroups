'use client';
import axios from "axios";
import { useState } from "react";
import React from "react";
import '../styles.css';
import { useRouter } from "next/navigation";

function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error before new request
    setSuccess(false);

    try {
      const response = await axios.post("http://localhost:8000/login", formData,);
      console.log("success");

      setSuccess(true);

      localStorage.setItem("username", formData.username);
      await router.push("/dashboard");


    } catch (error) {
      setError(error.response?.data?.error || "Login failed");
    }

    // try {
    //
    // } catch (error){
    //   setError(error.response?.data?.error);
    // }
  };

  return (
    <div className="login-wrapper">
      <h1>Please Log In:</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>Login successful!</p>}
      <form onSubmit={handleSubmit}>
        <fieldset>
          <label>
            <p>Username</p>
            <input type="text" name="username" value={formData.username} onChange={handleChange} required />
          </label>
          <label>
            <p>Password</p>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </label>
        </fieldset>
        <button type="submit">Submit</button>
      </form>
      {token && <p>Token: {token}</p>}
    </div>
  );
}

export default LoginPage;
