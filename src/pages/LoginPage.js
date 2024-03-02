import React, { useState } from 'react';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // remove token from local storage
    localStorage.removeItem('token');
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
    
            const data = await response.json(); // Parse JSON response
    
            if (response.ok) {
                // JWT token is in the response data under the key 'access_token'
                localStorage.setItem('token', data.access_token); // Store the token
    
                // Redirect to the dashboard
                window.location.href = '/';
            } else {
                // Handle server errors or invalid input
                console.error('Login failed:', data.message);
                setErrorMessage(data.message || 'Login failed. Please try again.')
            }
        } catch (error) {
            console.error('An error occurred:', error);
            // Handle fetch errors (e.g., no network)
            // Optionally, update the UI to inform the user that the login attempt failed
            setErrorMessage('The login attempt failed. Please try again later.');
        }
    };
    

    return (
        <div className='Login'>
            <h2>Login</h2>
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
                <button type="submit">Log In</button>
            </form>
            {errorMessage && <div className="error-message">{errorMessage}</div>} 
            <div className="signup-prompt">
            <p>Don't have an account, <a href="/signup">Sign Up</a></p>
            </div>
        </div>
    );
}

export default Login;
