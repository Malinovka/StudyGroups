"use client";
import { useState } from "react";
import JoinGroupModal from "./JoinGroupModal";

const JoinGroupButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition"
      >
        + Join Group
      </button>

      {isModalOpen && <JoinGroupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default JoinGroupButton;

