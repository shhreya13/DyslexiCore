// frontend/app/(auth)/login/page.tsx

'use client';

import React, { useState } from 'react';
import { useAuth } from '../../layout';
import Link from 'next/link';
import '../page.css'; // Import new styles

// Define form data structure for TypeScript
interface LoginFormData {
    username: string;
    password: string;
}

export default function Login() {
    const { login } = useAuth();
    const [formData, setFormData] = useState<LoginFormData>({
        username: '', // FastAPI expects 'username' for the email
        password: '',
    });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        try {
            const formBody = new URLSearchParams();
            formBody.append('username', formData.username);
            formBody.append('password', formData.password);

            // POST /auth/token requires x-www-form-urlencoded
            const response = await fetch('http://127.0.0.1:8000/auth/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formBody.toString(),
            });

            if (response.ok) {
                const data: { access_token: string; token_type: string } = await response.json();
                
                // Use the username submitted for mock user data
                const email = formData.username; 
                const firstName = email.split('@')[0]; 
                
                const userData = { email: email, first_name: firstName }; 
                
                login(data.access_token, userData);
                // The useAuth hook should handle navigation to the dashboard
            } else {
                const errorData = await response.json();
                setError(errorData.detail || 'Login failed.');
            }
        } catch (err) {
            setError('Network error. Check if the backend is running.');
        }
    };

    return (
        <div className="auth-page-wrapper">
            <div className="form-container">
                <h1>Welcome Back!</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        name="username"
                        placeholder="Email"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit">Login</button>
                </form>
                {error && <p className="message-error">{error}</p>}
                <p style={{ textAlign: 'center', marginTop: '15px' }}>
                    Don't have an account? <Link href="/register">Register here</Link>
                </p>
            </div>
        </div>
    );
}