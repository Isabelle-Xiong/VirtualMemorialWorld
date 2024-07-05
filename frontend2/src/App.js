// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Avatar from './components/Avatar';
import EditAvatar from './components/EditAvatar';
import Logout from './components/Logout';
import Profile from './components/Profile';
import PrivateRoute from './components/PrivateRoute';
import Navigation from './components/Navigation';
import RequestResetPassword from './components/RequestResetPassword';
import ResetPassword from './components/ResetPassword';
import VerifyEmail from './components/VerifyEmail';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import VirtualClock from './components/VirtualClock';

function App() {
  const handleTick = (virtualTime) => {
    console.log("Virtual Time:", virtualTime);
    // Here you can call functions to update avatar routines and relationships
  };

  return (
    <Router>
      <div className="App">
        <Navigation />
        <VirtualClock speedMultiplier={60} onTick={handleTick} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/request-reset-password" element={<RequestResetPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route
            path="/avatar"
            element={
              <PrivateRoute>
                <Avatar />
              </PrivateRoute>
            }
          />
          <Route
            path="/edit-avatar/:id"
            element={
              <PrivateRoute>
                <EditAvatar />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
        </Routes>
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;