import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import List from '../components/List';

const HomePage = () => {
    const [tasks, setTasks] = useState([]);
    const [lists, setLists] = useState([]);
    
    useEffect(() => {
        const fetchTasks = async () => {
            const token = localStorage.getItem('token'); 
            try {
                const response = await fetch('http://127.0.0.1:5000/lists', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    window.location.href = '/login'; // Redirect to login page if not authorized
                    //throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setTasks(data);
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };

        fetchTasks();
        // if token is not present, redirect to login page
        if (!localStorage.getItem('token')) {
            window.location.href = '/login';
        }

        const getLists = async () => {
            const token = localStorage.getItem('token');
            fetch('http://127.0.0.1:5000/get-lists', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                .then(response => response.json())
                .then(data => {
                    setLists(data);
                })
                .catch(error => console.error('Error:', error));
            
        };
        getLists();
            }, []);

    const onEdit = (id, title) => {
        const token = localStorage.getItem('token');
        fetch('http://127.0.0.1:5000/edit-task', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ id, title }),
        })
        .then(response => response.json())
        .then(data => {
            // Update the local state to reflect the edited task
            const updatedTasks = tasks.map(task => {
                if (task.id === id) {
                    return { ...task, title };
                }
                return task;
            });
            setTasks(updatedTasks);
        })
        .catch(error => console.error('Error:', error));
    };

    const onDelete = (id) => {
        const token = localStorage.getItem('token');
        fetch(`http://127.0.0.1:5000/delete-task/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            // Update local state to remove the deleted task
            const remainingTasks = tasks.filter(task => task.id !== id);
            setTasks(remainingTasks);
        })
        .catch(error => console.error('Error:', error));
    };

    const onMoveTask = (taskId, newListId) => {
        const token = localStorage.getItem('token');
        fetch(`http://127.0.0.1:5000/move-task/${taskId}/${newListId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log('Move successful:', data);
            window.location.href = '/'; // Refresh the page
        })
        .catch(error => console.error('Error:', error));
    };
    

    const renderTasks = () => {
        // Group tasks by list_id
        const groupedTasks = tasks.reduce((acc, task) => {
            if (!acc[task.list_id]) acc[task.list_id] = [];
            acc[task.list_id].push(task);
            return acc;
        }, {});
        
        // Merge tasks with their respective lists
        const listsWithTasks = lists.map(list => ({
            ...list,
            tasks: groupedTasks[list.id] || [] // Ensures that lists without tasks get an empty array
        }));
        return listsWithTasks.map(list => (
            <div key={list.id} className='column'>
                <List key={list.id} list={list} onEdit={onEdit} onDelete={onDelete} onMoveTask={onMoveTask} lists={lists}/>
                <Link to={`/new-task/${list.id}`} className='addTask'>Add New Task</Link>
            </div> 
        ));    
    };

    const Wrapper = () => {
        return (
            <div className='columns'>
                {renderTasks()}
            </div>
        );
    };
    
    return (
        <>
            <div className="home-page">
                <h2>Lists</h2>
                <Wrapper />
            </div>
        </>
    );
};

export default HomePage;
