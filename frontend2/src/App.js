import React, { useCallback } from 'react';
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
import ResetPassword from './components/ResetPassword';
import VerifyEmail from './components/VerifyEmail';
import VirtualClock from './components/VirtualClock';
import 'bootstrap/dist/css/bootstrap.min.css';
import useVirtualTime from './hooks/useVirtualTime';
import axios from 'axios';
import CustomizeAvatar from './components/CustomizeAvatar';
import './App.css';
import Draggable from 'react-draggable';
import RequestSecurityQuestion from './components/RequestSecurityQuestion';

function App() {
  const { virtualSeconds, virtualDay, setVirtualDay } = useVirtualTime(48);

  const handleTick = useCallback((newVirtualTime) => {
    // No need for setVirtualSeconds here
  }, []);

  const fetchAvatars = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found, please log in.');
      return [];
    }
    try {
      const response = await axios.get('http://localhost:5001/api/avatars', {
        headers: { 'x-auth-token': token },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching avatars:', error);
      return [];
    }
  };

  const incrementDayAndGenerateGoals = async () => {
    setVirtualDay(prevDay => {
      const newDay = prevDay + 1;
      localStorage.setItem('virtualDay', newDay);
      return newDay;
    });

    const avatars = await fetchAvatars();

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found, please log in.');
      return;
    }

    try {
      // Update goal statuses and generate new goals for each avatar
      for (const avatar of avatars) {
        await axios.post('http://localhost:5001/api/update-goal-status', { avatarId: avatar._id }, {
          headers: { 'x-auth-token': token },
        });

        await axios.post('http://localhost:5001/api/generate-new-goal', { avatarId: avatar._id }, {
          headers: { 'x-auth-token': token },
        });
      }
    } catch (error) {
      console.error('Error incrementing day and generating goals:', error);
    }
  };

  const formatVirtualTime = (seconds) => {
    const virtualHours = Math.floor((seconds * 24) / 1800); // convert 30 minutes to 24 virtual hours
    const virtualMinutes = Math.floor(((seconds * 24) % 1800) / 30);
    return `${virtualHours.toString().padStart(2, '0')}:${virtualMinutes.toString().padStart(2, '0')}`;
  };

  return (
    <Router>
      <div className="App">
        <Navigation />
        <Draggable>
          <div className="virtual-time-container">
            <h2>Virtual Time: {formatVirtualTime(virtualSeconds)}</h2>
            <h2>Virtual Day: {virtualDay}</h2>
            <button onClick={incrementDayAndGenerateGoals}>Increment Day Manually</button>
          </div>
        </Draggable>
        <Routes>
          <Route path="/" element={<Home virtualTime={virtualSeconds} virtualDay={virtualDay} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/request-reset-password" element={<RequestSecurityQuestion />} />
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
            path="/customize-avatar"
            element={
              <PrivateRoute>
                <CustomizeAvatar />
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
        
        <VirtualClock speedMultiplier={48} onTick={handleTick} />
      </div>
    </Router>
  );
}

export default App;