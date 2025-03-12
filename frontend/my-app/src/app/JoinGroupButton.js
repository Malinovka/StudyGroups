import React, { useState } from "react";
import Modal from "./modal/modal";

const JoinGroupButton = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <button onClick={() => setShowModal(true)}>Show Modal</button>
      <Modal show={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default JoinGroupButton;
// "use client";
// import { useState } from "react";
// import JoinGroupModal from "./JoinGroupModal";
// import Modal from "./modal/modal";

// const JoinGroupButton = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   return (
//     <div>
//       <button
//         onClick={() => setIsModalOpen(true)}
//         className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition"
//       >
//         + Join Group
//       </button>
//       <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} />

//       {isModalOpen && <JoinGroupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
//     </div>
//   );
// };

// export default JoinGroupButton;

