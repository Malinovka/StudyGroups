import React, { useState } from 'react';

const GroupList = ({ groups, onGroupSelect }) => {
  const [selectedGroup, setSelectedGroup] = useState(null);

  const handleGroupClick = (group) => {
    console.log('Selected Group:', group);
    setSelectedGroup(group); // Update the local state
    onGroupSelect(group);    // Notify the parent component
  };

  console.log('Groups:', groups);
  console.log('onGroupSelect Function:', onGroupSelect);
  return (
    <div style={{ maxHeight: '300px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px' }}>
      <ul>
        {groups.map((group, index) => (
          <li
            key={index}
            onClick={() => handleGroupClick(group)}
            style={{
              cursor: 'pointer',
              padding: '8px',
              backgroundColor: selectedGroup === group ? '#e0f7fa' : 'transparent',
              color: selectedGroup === group ? 'black' : 'white', // Change font color when selected
              transition: 'background-color 0.3s, color 0.3s', // Smooth transition
            }}
          >
            {group.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroupList;