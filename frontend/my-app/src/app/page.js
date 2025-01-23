'use client';
import React, { useState } from 'react';
import ChatBox from './chatbox';
import GroupList from './GroupSelector';
import './styles.css';

const App = () => {
    const [messages, setMessages] = useState([]);

    const handleSendMessage = ({ html, plainText }) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: 'You', html: html, plainText: plainText },
        ]);
    };

    const groups = [
        { name: 'Group 1' },
        { name: 'Group 2' },
        { name: 'Group 3' },
        { name: 'Group 4' },
        { name: 'Group 5' },
        { name: 'Group 6' },
        { name: 'Group 7' },
        { name: 'Group 8' },
        { name: 'Group 9' },
        { name: 'Group 10' }
      ];
    
      const handleGroupSelect = (group) => {
        console.log('Selected Group:', group);
      };

    return (
        <div className="page-container">
        <div className="page">
            <div className="main">
                <ChatBox messages={messages} onSendMessage={handleSendMessage} />
            </div>
        </div>
        <div>
        <h1>Select a Group</h1>
        <GroupList groups={groups} onGroupSelect={handleGroupSelect} />
      </div>
      </div>
    );
    
};

export default App;