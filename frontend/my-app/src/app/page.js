'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import socketClient  from "socket.io-client";
const SERVER = "http://127.0.0.1:8080";

const App = () => {
    useEffect(() => {
        var socket = socketClient(SERVER, {
            withCredentials: true,  // Ensures CORS works correctly
            transports: ['websocket', 'polling']
        });

        socket.on('connect', () => {
            console.log("I'm connected with the back-end");
        });

        socket.on('disconnect', () => {
            console.log("Disconnected from server");
        });

        return () => {
            socket.disconnect();  // Cleanup when component unmounts
        };
    }, []);
    const router = useRouter();

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Welcome to Our App</h1>

            <div style={{ marginTop: "20px" }}>
                <button
                    onClick={() => router.push('/registerUser')}
                    style={{ padding: "10px 20px", margin: "10px", fontSize: "16px" }}
                >
                    Register
                </button>

                <button
                    onClick={() => router.push('/login-page')}
                    style={{ padding: "10px 20px", margin: "10px", fontSize: "16px" }}
                >
                    Login
                </button>
            </div>
        </div>
    );
};

export default App;
