'use client';
import React, { useState } from 'react';
import ChatBox from './chatbox';
import './styles.css';

const App = () => {
    const [messages, setMessages] = useState([]);

    const handleSendMessage = ({ html, plainText }) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: 'You', html: html, plainText: plainText },
        ]);
    };

    return (
        <div className="page">
            <div className="main">
                <ChatBox messages={messages} onSendMessage={handleSendMessage} />
            </div>
            <footer className="footer">
                <p>Powered by Next.js</p>
            </footer>
        </div>
    );
};

export default App;