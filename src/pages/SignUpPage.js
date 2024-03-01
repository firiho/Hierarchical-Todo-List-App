import React, { useState } from 'react';

function Signup() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:5000/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
        if (response.ok) {
            // Redirect to login page on successful signup
            window.location.href = '/login';

        } else {
            // Handle server errors or invalid input
            console.error('Signup failed');
            setErrorMessage('Signup failed. Please try again.');
        }
        } catch (error) {
            console.error(error.response.data);
            // Handle fetch errors (e.g., no network)
            setErrorMessage('The signup attempt failed. Please try again later.');
        }
    };

    return (
        <div className='Login'>
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit} className='form'>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <button type="submit">Sign Up</button>
            </form>
            {errorMessage && <div className="error-message">{errorMessage}</div>} 
            <div className="signup-prompt">
            <p>Already have an account, <a href="/login">Sign In</a></p>
            </div>
        </div>
    );
}

export default Signup;
