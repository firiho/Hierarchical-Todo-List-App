import Container from 'react-bootstrap/Container';
import React from 'react'; // Ensure React is imported

export default function Header() {
  const isLoggedIn = localStorage.getItem('token');

  const logout = () => {
    localStorage.removeItem('token'); 
    window.location.href = '/login';
  };

  const home = () => {
    window.location.href = '/';
  };

  const newList = () => {
    window.location.href = '/new-list';
  };

  return (
    <Container className='Header-brand'>
      <h1 style={{ float: 'left' }}>To Do Lists</h1>
      {isLoggedIn && (
        <>
          <button onClick={logout} style={{ float: 'right' }}>Logout</button>
          <button onClick={newList} style={{ float: 'right' }}>New List</button>
          <button onClick={home} style={{ float: 'right' }}>Home</button>
        </>
      )}
    </Container>
  );
}
