import React, { useState } from 'react';

const NewListPage = ({ history }) => {
  const [listName, setListName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Assume you have a function to call your backend API to create the list
    try {
      await fetch('http://127.0.0.1:5000/create-list', { // Update with your actual endpoint
        method: 'POST',
        headers: {
            'authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
          // Include authorization header if your API requires it
        },
        body: JSON.stringify({ name: listName }),
      });

      // After successful creation, you might want to redirect the user
      window.location.href = '/'; // Redirect to the home page
    } catch (error) {
      console.error('Failed to create the list:', error);
      // Handle errors (e.g., display an error message)
    }
  };

  return (
    <form onSubmit={handleSubmit} className='Login'>
      <input
        type="text"
        id="listName"
        required
        placeholder='Enter a new list name'
        value={listName}
        onChange={(e) => setListName(e.target.value)}
      />
        <br />
      <button type="submit">Create List</button>
    </form>
  );
};

export default NewListPage;