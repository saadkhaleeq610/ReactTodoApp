import React, { useState, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import DeleteConfirmationModal from './DeleteConfirmationModal';

const Task = ({ task, index, moveTask, handleEdit, handleDelete }) => {
  const [{ isDragging }, drag] = useDrag({
    item: { type: 'task', index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'task',
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      moveTask(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const opacity = isDragging ? 0.5 : 1;

  return (
    <div ref={node => drop(node)} style={{ opacity }}>
      <div ref={drag}>
        {/* Your task UI here */}
        <div className="bg-gray-100 rounded-md p-3 my-2 w-full flex items-center justify-between">
          <div>{task}</div>
          <div className="flex items-center">
            <button className="text-blue-500 hover:text-blue-700 mr-2" onClick={() => handleEdit(index)}>
              Edit
            </button>
            <button className="text-red-500 hover:text-red-700" onClick={() => handleDelete(index)}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TaskInput = () => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState(JSON.parse(localStorage.getItem('tasks')) || []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const moveTask = (dragIndex, hoverIndex) => {
    const dragTask = tasks[dragIndex];
    setTasks((prevTasks) => {
      const updatedTasks = [...prevTasks];
      updatedTasks.splice(dragIndex, 1);
      updatedTasks.splice(hoverIndex, 0, dragTask);
      return updatedTasks;
    });
  };

  const handleEdit = (index) => {
    // Implement edit functionality
  };

  const handleDelete = (index) => {
    // Implement delete functionality
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (task.trim() !== '') {
      setTasks([...tasks, task]);
      setTask('');
    }
  };

  return (
    <div className="flex flex-col items-center">
      <form onSubmit={handleSubmit} className="mt-4 flex items-center">
        <div className="flex">
          <input
            type="text"
            value={task}
            onChange={(event) => setTask(event.target.value)}
            placeholder="Enter your task..."
            className="border border-gray-300 px-3 py-2 rounded-l-md focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-2 rounded-r-md whitespace-nowrap align-middle"
          >
            Add Task
          </button>
        </div>
      </form>
      <div className="mt-6 w-full">
        <h2 className="text-lg font-semibold">Tasks:</h2>
        {tasks.map((task, index) => (
          <Task
            key={index}
            task={task}
            index={index}
            moveTask={moveTask}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        ))}
      </div>
      <DeleteConfirmationModal />
    </div>
  );
};

export default TaskInput;
