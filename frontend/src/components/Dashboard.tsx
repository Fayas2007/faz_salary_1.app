import React, { useState, useRef, useEffect } from 'react';
import { FiHome, FiFolder, FiUsers, FiSettings, FiHelpCircle, FiMenu, FiSearch, FiBell, FiMessageSquare, FiChevronDown } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [showDepartmentPopup, setShowDepartmentPopup] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  // Close popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setShowDepartmentPopup(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDepartmentSelect = (department: string) => {
    console.log(`Selected department: ${department}`);
    setShowDepartmentPopup(false);
    // Here you can add navigation or state update based on the selected department
  };
  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <FiMenu className="menu-icon" />
          <h2>Logo</h2>
        </div>
        <nav className="nav-menu">
          <ul>
            <li className="active">
              <FiHome className="icon" />
              <span>Dashboard</span>
            </li>
            <li 
              className={`nav-item ${showDepartmentPopup ? 'active' : ''}`} 
              onClick={(e) => {
                e.stopPropagation();
                setShowDepartmentPopup(!showDepartmentPopup);
              }}
            >
              <FiUsers className="icon" />
              <span>Daily Work Logs</span>
              <FiChevronDown className="chevron-icon" />
              {showDepartmentPopup && (
                <div className="department-popup" ref={popupRef}>
                  <div className="popup-arrow"></div>
                  <div 
                    className="popup-item" 
                    onClick={() => handleDepartmentSelect('cutting')}
                  >
                    Cutting
                  </div>
                  <div 
                    className="popup-item" 
                    onClick={() => handleDepartmentSelect('grading')}
                  >
                    Grading
                  </div>
                </div>
              )}
            </li>
            <li onClick={() => navigate('/employee-settings')} style={{ cursor: 'pointer' }}>
              <FiFolder className="icon" />
              <span>Employee Settings</span>
            </li>
            <li>
              <FiSettings className="icon" />
              <span>Settings</span>
            </li>
            <li className="help">
              <FiHelpCircle className="icon" />
              <span>Help</span>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Top Header */}
        <header className="top-header">
          <div className="search-bar">
            <FiSearch className="search-icon" />
            <input type="text" placeholder="Search..." />
          </div>
          <div className="user-actions">
            <button className="icon-button">
              <FiMessageSquare />
            </button>
            <button className="icon-button">
              <FiBell />
            </button>
            <div className="user-avatar">
              <span>JD</span>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="dashboard-content">
          {/* Left Content */}
          <div className="left-content">
            {/* Welcome Section */}
            <section className="welcome-section">
              <h1>Welcome back, Fazil</h1>
              <p>Here's what's happening with your projects today</p>
            </section>

            {/* Quick Access */}
            <section className="quick-access">
              <div className="section-header">
                <h2>Quick Access</h2>
                <button className="view-all">View All</button>
              </div>
              <div className="quick-access-grid">
                {/* Quick Access Items will go here */}
              </div>
            </section>

            {/* Files Section */}
            <section className="files-section">
              <div className="section-header">
                <h2>Files</h2>
                <button className="view-all">View All</button>
              </div>
              <div className="files-grid">
                {/* Files will go here */}
              </div>
            </section>
          </div>

          {/* Right Sidebar */}
          <aside className="right-sidebar">
            <div className="activity-section">
              <div className="section-header">
                <h2>Activity</h2>
                <button className="view-all">View All</button>
              </div>
              <div className="activity-list">
                {/* Activity items will go here */}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
