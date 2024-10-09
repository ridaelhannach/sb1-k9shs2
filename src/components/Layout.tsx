import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, History, Settings, LogOut, Users } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md">
        <nav className="mt-5">
          <Link to="/" className="block px-4 py-2 text-gray-600 hover:bg-gray-200">
            <Home className="inline-block mr-2" size={20} />
            Home
          </Link>
          <Link to="/history" className="block px-4 py-2 text-gray-600 hover:bg-gray-200">
            <History className="inline-block mr-2" size={20} />
            History
          </Link>
          <Link to="/settings" className="block px-4 py-2 text-gray-600 hover:bg-gray-200">
            <Settings className="inline-block mr-2" size={20} />
            Settings
          </Link>
          {isAdmin && (
            <Link to="/admin" className="block px-4 py-2 text-gray-600 hover:bg-gray-200">
              <Users className="inline-block mr-2" size={20} />
              Admin
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-200"
          >
            <LogOut className="inline-block mr-2" size={20} />
            Logout
          </button>
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;