import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TaskPage from './pages/Tasks'; // Task list
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      <div className="pt-20 px-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/tasks" element={<PrivateRoute><TaskPage /></PrivateRoute>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
