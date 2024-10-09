import React, { useState, useEffect } from 'react';

interface User {
  username: string;
  isAdmin: boolean;
}

interface HistoryEntry {
  username: string;
  date: string;
  results: any[];
}

const Admin: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [allHistory, setAllHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    // Load users from localStorage
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    setUsers(storedUsers);

    // Load all history
    const storedHistory = JSON.parse(localStorage.getItem('allRandomizationHistory') || '[]');
    setAllHistory(storedHistory);
  }, []);

  const addUser = () => {
    if (newUsername && newPassword) {
      const newUser: User = { username: newUsername, isAdmin: false };
      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      // In a real app, you'd hash the password before storing
      localStorage.setItem(`password_${newUsername}`, newPassword);
      setNewUsername('');
      setNewPassword('');
    }
  };

  const changePassword = () => {
    if (selectedUser && newPassword) {
      // In a real app, you'd hash the password before storing
      localStorage.setItem(`password_${selectedUser}`, newPassword);
      setNewPassword('');
      alert('Password changed successfully');
    }
  };

  const toggleAdminStatus = (username: string) => {
    const updatedUsers = users.map(user => 
      user.username === username ? { ...user, isAdmin: !user.isAdmin } : user
    );
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">User Management</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="New Username"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            className="mr-2 p-2 border rounded"
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mr-2 p-2 border rounded"
          />
          <button onClick={addUser} className="bg-green-500 text-white px-4 py-2 rounded">
            Add User
          </button>
        </div>
        <div className="mb-4">
          <select
            value={selectedUser || ''}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="mr-2 p-2 border rounded"
          >
            <option value="">Select User</option>
            {users.map(user => (
              <option key={user.username} value={user.username}>{user.username}</option>
            ))}
          </select>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mr-2 p-2 border rounded"
          />
          <button onClick={changePassword} className="bg-blue-500 text-white px-4 py-2 rounded">
            Change Password
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Username</th>
              <th className="text-left">Admin Status</th>
              <th className="text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.username}>
                <td>{user.username}</td>
                <td>{user.isAdmin ? 'Admin' : 'User'}</td>
                <td>
                  <button
                    onClick={() => toggleAdminStatus(user.username)}
                    className="text-blue-500 underline"
                  >
                    Toggle Admin
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div>
        <h2 className="text-2xl font-semibold mb-4">All User History</h2>
        {allHistory.map((entry, index) => (
          <div key={index} className="mb-4 p-4 bg-white rounded shadow">
            <h3 className="font-semibold">{entry.username}</h3>
            <p>{new Date(entry.date).toLocaleString()}</p>
            <ul>
              {entry.results.map((result, i) => (
                <li key={i}>{result.name}: Door {result.doorNumber}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;