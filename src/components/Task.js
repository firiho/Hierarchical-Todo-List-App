import React, { useState } from 'react';

const Task = ({ task, onEdit, onDelete, onMoveTask, lists, isTopLevel = true }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(task.title);

    const handleToggleVisibility = (e) => {
        e.stopPropagation();
        setIsVisible(!isVisible);
    };  

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleDelete = () => {
        onDelete(task.id);
    };

    const handleSave = () => {
        onEdit(task.id, editTitle);
        setIsEditing(false);
    };

    const handleChange = (e) => {
        setEditTitle(e.target.value);
    };

    const handleMoveTask = (taskId, newListId) => {
        console.log('newListId', taskId, newListId);
        onMoveTask(taskId, newListId);
    };

    const getFilteredLists = () => lists.filter(list => list.id !== task.list_id);

    return (
        <div style={{ cursor: 'pointer', marginBottom: '10px' }}>
            {isEditing ? (
                <div className='task'>
                    <input type="text" value={editTitle} onChange={handleChange} />
                    <button onClick={handleSave}>Save</button>
                </div>
            ) : (
                <div className='task'>
                    <h5 className='taskName'>
                    {task.title}
                    </h5>
                    {isTopLevel && (
                        <select onChange={(e) => handleMoveTask(task.id, e.target.value)}>
                            <option value="">Move to</option>
                            {getFilteredLists()?.map(list => (
                                <option key={list.id} value={list.id}>{list.name}</option>
                            ))}
                        </select>
            )}

                    <button onClick={handleEdit} style={{ marginLeft: '10px', color: 'black' , backgroundColor: 'rgb(103, 222, 255)'}}>Edit</button>
                    <button onClick={handleDelete} style={{ marginLeft: '10px', color: 'black', backgroundColor: '#ffd7d7'}}>x</button>
                    {task.sub_items && task.sub_items.length > 0 && (
                        <button onClick={handleToggleVisibility} style={{ marginLeft: '10px' }}>
                            {isVisible ? '↑' : '↓'}
                        </button>
                    )}
                </div>
            )}
            {isVisible && task.sub_items && task.sub_items.length > 0 && (
                <div className="sub-tasks" style={{ marginLeft: '20px' }}>
                    {task.sub_items.map(subItem => (
                        <Task key={subItem.id} task={subItem} onEdit={onEdit} onDelete={onDelete} lists={lists} isTopLevel = {false}/>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Task;
