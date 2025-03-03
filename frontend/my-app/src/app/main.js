'use client';
import React, {useEffect, useState} from 'react';
import ChatBox from './chatbox';
import GroupList from './GroupSelector';
import './styles.css';
import axios from 'axios';

const Dashboard = () => {
    const [messages, setMessages] = useState([]);
    const [groups, setGroups] = useState([]);
    const [newGroup, setNewGroup] = useState({ name: '', owner: '', memberLimit: '' });
    const handleInputChange = (e) => {
        setNewGroup({ ...newGroup, [e.target.name]: e.target.value });
    };

    const handleCreateGroup = async (e) => {
        e.preventDefault();
        if (!newGroup.name || !newGroup.owner || !newGroup.memberLimit) {
            alert("All fields are required");
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/api/groups', newGroup);
            console.log("Group created:", response.data);

            setGroups([...groups, newGroup]);
            setNewGroup({ name: '', owner: '', memberLimit: '' }); // Reset form
        } catch (error) {
            console.error('Error creating group:', error);
        }
    };

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/groups');
                console.log('API Response:', response.data); // Debugging step

                // Transform data to match expected structure
                const formattedGroups = response.data.data.map(group => ({
                    name: group.name, // Ensure lowercase `name`
                    owner: group.owner,
                    memberLimit: group.memberLimit,
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
                    <ChatBox messages={messages} onSendMessage={handleSendMessage}/>
                </div>
            </div>
            <div>
                <h1>Select a Group</h1>
                <GroupList groups={groups} onGroupSelect={handleGroupSelect}/>

                <h2>Create a New Group</h2>
                <form onSubmit={handleCreateGroup}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Group Name"
                        value={newGroup.name}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        type="text"
                        name="owner"
                        placeholder="Owner Username"
                        value={newGroup.owner}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        type="number"
                        name="memberLimit"
                        placeholder="Member Limit"
                        value={newGroup.memberLimit}
                        onChange={handleInputChange}
                        required
                    />
                    <button type="submit">Create Group</button>
                </form>
            </div>
        </div>
)
    ;

};

export default Dashboard;