import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Corrected import for jwt-decode
import { useParams } from 'react-router-dom';

const NewTaskPage = () => {
    // if token is not present, redirect to login page
    if (!localStorage.getItem('token')) {
        window.location.href = '/login';
    }
  const { listId } = useParams();
  const [nextId, setNextId] = useState(10000000); 
  const [numSub, setNumSub] = useState(1);

  useEffect(() => {
    const getNextTaskId = async () => {

      try {
        const response = await fetch('http://127.0.0.1:5000/next-id', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
        const data = await response.json();
        setNextId(data.next_id);
        } else {
          throw new Error('Network response was not ok.');
        }
      } catch (error) {
        console.error('Failed to fetch nextId:', error);
      }
    };

    getNextTaskId();
  }, []);

    let tempId = 100000000;
  // State to hold the main task and its subtasks
  const [tasks, setTasks] = useState([
    { id: nextId, title: '', subtasks: [{ id: nextId + 1, title: '', subsubtasks: [{ id: tempId, title: '' }] }] },
  ]);

  const getCurrentUserId = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.sub.identity; 
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Assuming you have a way to get the current user's ID
    const userId = getCurrentUserId(); // You need to implement this based on your auth system

    function collectAndOrderTasks(tasks, userId) {
        let mainTasks = [];
        let subTasks = [];
        let subSubTasks = [];
    
        // Collect main tasks
        tasks.forEach(task => {
            mainTasks.push({ ...task, list_id: listId, parent_id: null, user_id: userId });
            
            // Collect subtasks
            let i = 1;
            task.subtasks.forEach(subtask => {
                subTasks.push({ ...subtask, list_id: listId, parent_id: nextId, user_id: userId });
    
                // Collect sub-subtasks
                
                subtask.subsubtasks.forEach(subsubtask => {
                    subSubTasks.push({ ...subsubtask, list_id: listId, parent_id: nextId + i, user_id: userId });
                });
                i = i + 1;
            });
        });
    
        // Concatenate all tasks in the desired order
        return [...mainTasks, ...subTasks, ...subSubTasks];
    }

    

// Usage
const flattenedTasks = collectAndOrderTasks(tasks, userId);


      console.log('Flattened tasks:', flattenedTasks);
    try {
      const response = await fetch('http://127.0.0.1:5000/new-list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include auth token if needed
        },
        body: JSON.stringify(flattenedTasks),
      });

      if (!response.ok) throw new Error('Network response was not ok.');
      // Handle success
      console.log('Tasks successfully submitted:', await response.json());
      window.location.href = '/'; // Redirect to the dashboard
    } catch (error) {
      console.error('Error submitting tasks:', error);
    }
};
    
  // Function to add a new subtask or sub-subtask
  const addSubTask = (taskId, subtaskId = null) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        if (subtaskId === null) {
          const newSubtaskId = tempId + numSub;
          task.subtasks.push({ id: newSubtaskId, title: '', subsubtasks: [] });
            setNumSub(numSub + 1);
        } else {
          task.subtasks.forEach(subtask => {
            if (subtask.id === subtaskId) {
              const newsubsubtaskid = tempId + numSub;
              subtask.subsubtasks.push({ id: newsubsubtaskid, title: '' });
              setNumSub(numSub + 1);
            }
          });
        }
      }
      return task;
    }));
  };
  

  // Function to handle task title change
  const handleTaskChange = (taskId, subtaskId, subsubtaskId, value) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        if (subtaskId === null) {
          task.title = value;
        } else {
          task.subtasks.forEach(subtask => {
            if (subtask.id === subtaskId) {
              if (subsubtaskId === null) {
                subtask.title = value;
              } else {
                subtask.subsubtasks.forEach(subsubtask => {
                  if (subsubtask.id === subsubtaskId) {
                    subsubtask.title = value;
                  }
                });
              }
            }
          });
        }
      }
      return task;
    }));
  };
  
  return (
      <div className="new-task-page">
        
        <form onSubmit={handleSubmit} className='Login'>
        <h2>New Task</h2>
          {tasks.map((task, taskIndex) => (
            <div key={task.id}>
              <input
                required
                type="text"
                name={`title-${task.id}`}
                placeholder="Title"
                value={task.title}
                onChange={(e) => handleTaskChange(task.id, null, null, e.target.value)}
              />
              <button type="button" onClick={() => addSubTask(task.id)}>Add Subtask</button>

              {task.subtasks.map((subtask) => (
                <div key={subtask.id}>
                  <input
                    required
                    type="text"
                    name={`title-${subtask.id}`}
                    placeholder="Subtask Title"
                    value={subtask.title}
                    onChange={(e) => handleTaskChange(task.id, subtask.id, null, e.target.value)}
                  />
                  <button type="button" onClick={() => addSubTask(task.id, subtask.id)}>Add Sub-Subtask</button>

                  {subtask.subsubtasks.map((subsubtask) => (
                    <input
                        key={subsubtask.id}
                        required
                        type="text"
                        name={`title-${subsubtask.id}`}
                        placeholder="Sub-Subtask Title"
                        value={subsubtask.title}
                        onChange={(e) => handleTaskChange(task.id, subtask.id, subsubtask.id, e.target.value)}
                    />
                ))}
                </div>
              ))}
            </div>
          ))}
          <button type="submit">Add Task</button>
        </form>
        </div>
    );
};   

export default NewTaskPage;