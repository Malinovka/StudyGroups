'use client';
import React, {useEffect, useState} from 'react';
import ChatBox from './chatbox';
import GroupList from './GroupSelector';
import './styles.css';
import axios from 'axios';

const App = () => {
    const [messages, setMessages] = useState([]);
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/groups');
                console.log('API Response:', response.data); // Debugging step

                // Transform data to match expected structure
                const formattedGroups = response.data.data.map(group => ({
                    name: group.Name, // Ensure lowercase `name`
                    owner: group.OwnerUsername,
                    memberLimit: group.MemberLimit,
                }));

                setGroups(formattedGroups);
            } catch (error) {
                console.error('Error fetching groups:', error);
            }
        };

        fetchGroups();
    }, []);


    const handleSendMessage = ({ html, plainText }) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: 'You', html: html, plainText: plainText },
        ]);
    };

    // const groups = [
    //     { name: 'Group 1' },
    //     { name: 'Group 2' },
    //     { name: 'Group 3' },
    //     { name: 'Group 4' },
    //     { name: 'Group 5' },
    //     { name: 'Group 6' },
    //     { name: 'Group 7' },
    //     { name: 'Group 8' },
    //     { name: 'Group 9' },
    //     { name: 'Group 10' }
    //   ];
    
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