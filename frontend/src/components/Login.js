import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import '../styles/Login.css'

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
        } catch (error) {
            console.error('Failed to login', error);
        }
    };

    return (
        <div className='body'>
        <div className="login-container">
            <h2>Login</h2>
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
                <button type="submit">Login</button>
            </form>
            <p>
                Don't have an account? <span onClick={() => navigate('/signup')}>Sign Up</span>
            </p>
        </div>
        </div>
    );
};

export default Login;
