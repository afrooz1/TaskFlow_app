import React from 'react';
import TaskList from '../components/TaskList';

const Tasks = () => {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6 text-cyber-blue-800">📝 My Tasks</h1>
      <TaskList />
    </div>
  );
};

export default Tasks;
