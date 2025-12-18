// frontend/app/(auth)/register/page.tsx

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '../page.css'; // Import new styles

// Define form data structure for TypeScript
interface RegisterFormData {
    email: string;
    password: string;
    first_name: string;
    age: string;
}

export default function Register() {
    const [formData, setFormData] = useState<RegisterFormData>({
        email: '',
        password: '',
        first_name: '',
        age: '',
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const response = await fetch('http://127.0.0.1:8000/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Ensure age is passed as a number, as required by your FastAPI model
                body: JSON.stringify({ ...formData, age: parseInt(formData.age) }), 
            });

            if (response.ok) {
                setMessage('Registration successful! Redirecting to login...');
                setTimeout(() => router.push('/login'), 2000);
            } else {
                const errorData = await response.json();
                setError(errorData.detail || 'Registration failed.');
            }
        } catch (err) {
            setError('Network error. Check if the backend is running.');
        }
    };

    return (
        <div className="auth-page-wrapper">
            <div className="form-container">
                <h1>Create Child Profile</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email (Parent/Child)"
                        value={formData.email}
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
                    <input
                        type="text"
                        name="first_name"
                        placeholder="Child's First Name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="number"
                        name="age"
                        placeholder="Child's Age"
                        value={formData.age}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit">Register</button>
                </form>
                {message && <p className="message-success">{message}</p>}
                {error && <p className="message-error">{error}</p>}
                <p style={{ textAlign: 'center', marginTop: '15px' }}>
                    Already have an account? <Link href="/login">Login here</Link>
                </p>
            </div>
        </div>
    );
}