import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import History from './pages/History';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Admin from './pages/Admin';

const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  return isLoggedIn ? element : <Navigate to="/login" />;
};

const AdminRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  return isAdmin ? element : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute element={<Layout><Home /></Layout>} />} />
        <Route path="/history" element={<PrivateRoute element={<Layout><History /></Layout>} />} />
        <Route path="/settings" element={<PrivateRoute element={<Layout><Settings /></Layout>} />} />
        <Route path="/admin" element={<AdminRoute element={<Layout><Admin /></Layout>} />} />
      </Routes>
    </Router>
  );
}

export default App;