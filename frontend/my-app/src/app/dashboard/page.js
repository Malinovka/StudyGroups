'use client';
import React, {useEffect, useRef, useState} from 'react';
import ChatBox from '../chatbox';
import GroupList from '../GroupSelector';
import '../styles.css';
import axios from 'axios';
import { useRouter } from "next/navigation";
import LogOutButton from '../LogOutButton';
import JoinGroupButton from '../JoinGroupButton';
import { io } from 'socket.io-client';

const SERVER = "http://localhost:8000";


const Dashboard = () => {
    const router = useRouter();
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [groups, setGroups] = useState([]);
    const [currentGroup, setCurrentGroup] = useState(null);

    const [newGroup, setNewGroup] = useState({ name: '', owner: '', memberLimit: '' });
    const [username, setUsername] = useState("");

    const messagesEndRef = useRef(null);

    const handleAddGroup = (group) => {
        setGroups((prev) => [...prev, group]);
    };
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        if (!storedUsername) {
            router.push("/login-page"); // Redirect to login if no user found
        } else {
            setUsername(storedUsername);
        }
    }, [router]);

    useEffect(() => {
        const newSocket = io(SERVER);
        setSocket(newSocket);

        newSocket.on("connect", () => {
            console.log("Connected to Socket.IO server");
        });

        newSocket.on("groupMessage", ({ sender, message, html }) => {
            setMessages((prev) => [...prev, { sender, plainText: message, html }]);
        });

        return () => newSocket.disconnect();
    }, []);

    const handleInputChange = (e) => {
        setNewGroup({ ...newGroup, [e.target.name]: e.target.value });
    };

    const handleCreateGroup = async (e) => {
        e.preventDefault();
        if (!newGroup.name || !newGroup.memberLimit) {
            alert("All fields are required");
            return;
        }
        try {
            const response = await axios.post('http://localhost:8000/api/groups', { ...newGroup, owner: username });
            console.log("Group created:", response.data);

            setGroups([...groups, { ...newGroup, owner: username }]);
            setNewGroup({ name: '', memberLimit: '' });
        } catch (error) {
            console.error('Error creating group:', error);
        }

        // try {
        //     const response = await axios.post('http://localhost:8000/api/groups', newGroup);
        //     console.log("Group created:", response.data);
        //
        //     setGroups([...groups, newGroup]);
        //     setNewGroup({ name: '', owner: '', memberLimit: '' }); // Reset form
        // } catch (error) {
        //     console.error('Error creating group:', error);
        // }
    };

    useEffect(() => {
        if (!username) return;
        const fetchGroups = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/groups?username=${username}`);
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
    }, [username]);


    const handleSendMessage = ({ html, plainText }) => {
        if (!currentGroup || !socket) return;

        const payload = {
            groupName: currentGroup.name,
            sender: username,
            message: plainText,
            html
        };

        setMessages((prev) => [...prev, { sender: 'You', plainText, html }]);
        socket.emit('groupMessage', payload);
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

    const handleGroupSelect = async (group) => {
        setCurrentGroup(group);
        setMessages([]);

        if (socket) {
            socket.emit("joinGroup", group.name);
        }

        try {
            const response = await axios.get(`http://localhost:8000/api/messages?group=${group.name}`);
            setMessages(response.data.messages.map(msg => ({
                sender: msg.Sender,
                plainText: msg.Message,
                html: msg.Html
            })));
        } catch (error) {
            console.error("Error loading messages:", error);
        }
    };


    return (
        <div className="page-container" style={{ position: "relative", zIndex: 1, marginTop: "50px" }}>
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
                        type="number"
                        name="memberLimit"
                        placeholder="Member Limit"
                        value={newGroup.memberLimit}
                        onChange={handleInputChange}
                        required
                    />
                    <button type="submit">Create Group</button>
                </form>
                <h2>Join a Group</h2>
                <JoinGroupButton onGroupJoined={handleAddGroup} />
                <h2>Log Out</h2>
                <LogOutButton></LogOutButton>
            </div>
        </div>
)
    ;

};

export default Dashboard;