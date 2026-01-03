import React from 'react';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="user-menu">
          <span className="username">Admin</span>
          <div className="avatar">A</div>
        </div>
      </header>
      
      <main className="dashboard-content">
        <div className="sidebar">
          <nav className="nav-menu">
            <ul>
              <li className="active"><i className="icon">📊</i> Overview</li>
              <li><i className="icon">📈</i> Analytics</li>
              <li><i className="icon">📋</i> Reports</li>
              <li><i className="icon">⚙️</i> Settings</li>
            </ul>
          </nav>
        </div>
        
        <div className="main-content">
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Users</h3>
              <p className="stat-value">1,234</p>
              <p className="stat-change positive">+12% from last month</p>
            </div>
            <div className="stat-card">
              <h3>Revenue</h3>
              <p className="stat-value">$48,290</p>
              <p className="stat-change positive">+8% from last month</p>
            </div>
            <div className="stat-card">
              <h3>Active Projects</h3>
              <p className="stat-value">24</p>
              <p className="stat-change negative">-2 from last week</p>
            </div>
          </div>
          
          <div className="recent-activity">
            <h2>Recent Activity</h2>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon">👤</div>
                <div className="activity-details">
                  <p>New user registered</p>
                  <span className="activity-time">2 minutes ago</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon">📊</div>
                <div className="activity-details">
                  <p>Monthly report generated</p>
                  <span className="activity-time">1 hour ago</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon">🔄</div>
                <div className="activity-details">
                  <p>System update completed</p>
                  <span className="activity-time">3 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
