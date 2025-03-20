"use client";
import axios from "axios";
import { useAuth } from "../provider/authProvider";
import React from "react";
import { useState, useEffect } from "react";
import "./modal.css" ;

const Modal = ({ show, onClose, onGroupJoined }) => {
  const { token, username } = useAuth(); // Retrieve username from context
  const [groupName, setGroupName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (show) {
      setGroupName(""); // Reset input field
      setError(""); // Clear error messages
      setSuccess(false); // Clear success message
    }
  }, [show]); // Runs whenever `show` changes

  if (!show) {
    return null; // Don't render if show is false
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    console.log("🔍 Username in AuthContext:", username);

    if (!groupName.trim()) {
      setError("Group name is required");
      return;
    }

    if (!username) {
      setError("Error: Username is missing from AuthContext");
      console.error("Username is missing in AuthContext");
      return;
    }

    try {
      console.log("Sending Request to:", `http://localhost:8000/groups/${encodeURIComponent(groupName)}/users`);
      console.log("Request Body:", { username });
      const response = await axios.post(
        `http://localhost:8000/groups/${encodeURIComponent(groupName)}/users`,
        { username }, // Send username from AuthContext
        {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        }
      );



      console.log(" Received response from backend:", response.data);

      if (response.data.message === "User is already in the group") {
        setSuccess(false);
        setError(" You are already in this group");
      } else if (response.data.message === "Group does not exist"){
        setSuccess(false);
        setError(" Group does not exist"); // Clear any previous errors
      } else {
        setSuccess(true);

        setError(""); // Clear any previous errors
        //const groupDetails = await axios.get(`http://localhost:8000/api/groups/${encodeURIComponent(groupName)}`);
        // onGroupJoined({
        //   name: groupDetails.data.name,
        //   owner: groupDetails.data.owner,
        //   memberLimit: groupDetails.data.memberLimit,
        // });
        onGroupJoined({ name: groupName, owner: "Unknown", memberLimit: "?" });

      }

      setTimeout(() => {
        console.log("🚀 Closing modal now...");
        onClose(); // Close the modal after 1 second
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.error || "Failed to join group");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <button onClick={onClose} className="absolute top-2 left-2 text-gray-600 text-lg font-bold">
          ✖
        </button>
        <h2 style={{ color:'purple'}} className="text-xl font-bold mb-4">Join a Group</h2>

        {error && <p style={{ color:'red'}}>{error}</p>}
        {success && <p style={{ color:'green'}}>Successfully joined!</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full p-2 border rounded mb-3"
          />
          <div className="flex justify-between">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Join Group
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
