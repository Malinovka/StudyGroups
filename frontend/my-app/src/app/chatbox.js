'use client';
import React, { useRef } from 'react';
import Editor from './Editor';
import './styles.css';

const ChatBox = ({ messages, onSendMessage }) => {
    const editorRef = useRef();

    const handleSend = () => {
        if (!editorRef.current) return;

        // Get the Quill Delta content and plain text
        const delta = editorRef.current.getContents();
        const html = editorRef.current.root.innerHTML.trim(); // Get HTML content
        const plainText = editorRef.current.getText().trim();

        if (!plainText) return; // Don't send empty messages

        // Send message with HTML content
        onSendMessage({ html, plainText });
        editorRef.current.setContents([]); // Clear the editor
    };

    return (
        <div className="chat-container">
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`chat-message ${msg.sender === 'You' ? 'chat-message-sender' : 'chat-message-receiver'}`}
                    >
                        <strong>{msg.sender}: </strong>
                        <div dangerouslySetInnerHTML={{ __html: msg.html }}></div>
                    </div>
                ))}
            </div>
            <div className="chat-editor-container">
                <Editor ref={editorRef} />
                <button className="chat-send-button" onClick={handleSend}>
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatBox;