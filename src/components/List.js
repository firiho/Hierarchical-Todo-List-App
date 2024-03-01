import React from 'react';
import Task from './Task'; 

const List = ({ list, onEdit, onDelete ,onMoveTask, lists}) => {
    const deleteList = (id) => {
        const token = localStorage.getItem('token');
        fetch(`http://127.0.0.1:5000/delete-list/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log('Delete successful:', data);
            // Update local state to remove the deleted list
            window.location.href = '/'; // Refresh the page
        })
        .catch(error => console.error('Error:', error));
    };
  return (
    <>
    <div className="list-header">
      <h3>{list.name}</h3> 
        <button onClick={() => deleteList(list.id)}>x</button>
        </div>
      <div>
        {list.tasks.map(task => (
          <Task key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} onMoveTask={onMoveTask} lists={lists}/>
        ))}
      </div>
    </>
  );
};

export default List;