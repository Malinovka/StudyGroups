'use client';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const RegisterUser = () => {
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        username: '',
        password: '',
        email: '',
    });

    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setSubmitted(false);
    };

    const validateForm = () => {
        const { firstname, lastname, username, password, email } = formData;
        if (!firstname || !lastname || !username || !password || !email) {
            return 'All fields are required.';
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            return 'Invalid email format.';
        }
        if (password.length < 6) {
            return 'Password must be at least 6 characters.';
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSubmitted(false);

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        //setLoading(true);
        try {
            const response = await axios.post('http://localhost:8000/api/register', formData);
            console.log('User created:', response.data);
            setSubmitted(true);
            setFormData({ firstname: '', lastname: '', username: '', password: '', email: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
            console.error('Error creating user:', err);
        }
        //setLoading(false);
    };


    const successMessage = () =>{
        return (
            <div
                className="success"
                style={{display:submitted ? "":"none",
                }}
                >
                <h1>User {formData.firstname} {formData.lastname} successfully registered</h1>
            </div>
        );
    };

    const errorMessage = () => {
        return (
            <div
                className="error"
                style={{display: error ? "" : "none",
                }}
                >
                <h1>Please enter all the fields</h1>
            </div>
        );
    };
    return (
        <div className="form" style={{ position: "relative", zIndex: 1, textAlign: "center", marginTop: "50px" }}>
            <div>
                <h1>User Registration</h1>
            </div>

            {/* Calling to the methods */}
            <div className="messages">
                {errorMessage()}
                {successMessage()}
            </div>

            <form style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* Labels and inputs for form data */}
                {/* <label className="label">First Name</label>
                <input name="firstname" onChange={handleChange} className="input" value={formData.firstname}
                       type="text"/>
                <br></br>
                <label className="label">Last Name</label>
                <input name="lastname" onChange={handleChange} className="input" value={formData.lastname} type="text"/>
                <br></br>
                <label className="label">Username</label>
                <input name="username" onChange={handleChange} className="input" value={formData.username} type="text"/>
                <br></br>
                <label className="label">Password</label>
                <input name="password" onChange={handleChange} className="input" value={formData.password}
                       type="password"/>
                <br></br>
                <label className="label">Email</label>
                <input name="email" onChange={handleChange} className="input" value={formData.email} type="email"/> */}

<TextField
        required
        label="First Name"
        name="firstname"
        value={formData.firstname}
        onChange={handleChange}
        margin="normal"
    />
    <TextField
        required
        label="Last Name"
        name="lastname"
        value={formData.lastname}
        onChange={handleChange}
        margin="normal"
    />
    <TextField
        required
        label="Username"
        name="username"
        value={formData.username}
        onChange={handleChange}
        margin="normal"
    />
    <TextField
        required
        type="password"
        label="Password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        margin="normal"
    />
    <TextField
        required
        type="email"
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        margin="normal"
    />
                <br></br>
                <br></br>
                <Button variant="contained" onClick={handleSubmit} className="btn" type="submit">
                    Submit
                </Button>
            </form>
        </div>
    );
}

export default RegisterUser;