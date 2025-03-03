"use client";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "./provider/authProvider"; // Import AuthContext

const JoinGroupModal = ({ isOpen, onClose }) => {
  const { token, username } = useAuth(); // Retrieve username from context
  const [groupName, setGroupName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null; // Don't render if modal is closed

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
      setError("❌ Error: Username is missing from AuthContext");
      console.error("❌ Username is missing in AuthContext");
      return;
    }

    try {
      console.log("🟢 Sending Request to:", `http://localhost:8000/groups/${encodeURIComponent(groupName)}/users`);
      console.log("📦 Request Body:", { username });
      const response = await axios.post(
        `http://localhost:8000/groups/${encodeURIComponent(groupName)}/users`,
        { username }, // Send username from AuthContext
        {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        }
      );

      console.log("✅ Successfully joined group:", response.data);
      setSuccess(true);
      setGroupName("");

      setTimeout(() => {
        onClose(); // Close the modal after 1 second
      }, 1000);
    } catch (error) {
      setError(error.response?.data?.error || "Failed to join group");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 text-lg font-bold">
          ✖
        </button>
        <h2 className="text-xl font-bold mb-4">Join a Group</h2>

        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">Successfully joined!</p>}

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

export default JoinGroupModal;

