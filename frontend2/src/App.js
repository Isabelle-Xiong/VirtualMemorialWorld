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
import RequestResetPassword from './components/RequestResetPassword';
import ResetPassword from './components/ResetPassword';
import VerifyEmail from './components/VerifyEmail';
import VirtualClock from './components/VirtualClock';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import useVirtualTime from './hooks/useVirtualTime';

function App() {
  const { virtualSeconds, virtualDay, setVirtualSeconds, setVirtualDay } = useVirtualTime(48);

  const handleTick = useCallback((newVirtualTime) => {
    setVirtualSeconds(newVirtualTime); // Update with the correct virtual time
  }, [setVirtualSeconds]);

  const incrementDayManually = () => {
    setVirtualSeconds(0);
    setVirtualDay(prevDay => {
      const newDay = prevDay + 1;
      localStorage.setItem('virtualDay', newDay);
      return newDay;
    });
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
        <div className="virtual-time">
          <h2>Virtual Time: {formatVirtualTime(virtualSeconds)}</h2>
          <h2>Virtual Day: {virtualDay}</h2>
          <button onClick={incrementDayManually}>Increment Day Manually</button>
        </div>
        <Routes>
          <Route path="/" element={<Home virtualTime={virtualSeconds} virtualDay={virtualDay} />} />
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
        <VirtualClock speedMultiplier={48} onTick={handleTick} />
      </div>
    </Router>
  );
}

export default App;