'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

const App = () => {
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
