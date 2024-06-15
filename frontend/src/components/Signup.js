import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import '../styles/Signup.css'

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signup(name, email, password);
        } catch (error) {
            console.error('Failed to sign up', error);
        }
    };

    return (
        <div className='body'>
        <div className="signup-container">
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <input
                style={{
                    width: '80%',
                    padding: '10px',
                    marginBottom: '10px',
                    boxSizing: 'border-box',
                    borderRadius: '5px',
                    border: '1px solid #ccc'
                }}
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                style={{
                    width: '80%',
                    padding: '10px',
                    marginBottom: '10px',
                    boxSizing: 'border-box',
                    borderRadius: '5px',
                    border: '1px solid #ccc'
                }}
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                style={{
                    width: '80%',
                    padding: '10px',
                    marginBottom: '10px',
                    boxSizing: 'border-box',
                    borderRadius: '5px',
                    border: '1px solid #ccc'
                }}
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Sign Up</button>
            </form>
            <p>
                Already have an account? <span onClick={() => navigate('/login')}>Login</span>
            </p>
        </div>
        </div>
    );
};

export default Signup;
