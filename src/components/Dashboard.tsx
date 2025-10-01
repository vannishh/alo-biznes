import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Order, Notification } from '../types';
import { getOrders, getNotifications } from '../data/mockData.ts';
import { ShoppingCart, Package, Bell, LogOut, User as UserIcon } from 'lucide-react';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Load user orders
    const userOrders = getOrders().filter(order => order.userId === user.id);
    setOrders(userOrders);

    // Load notifications
    const userNotifications = getNotifications(user.id);
    setNotifications(userNotifications);
    setUnreadCount(userNotifications.filter(n => !n.read).length);
  }, [user.id]);

  const markNotificationAsRead = (notificationId: string) => {
    const updatedNotifications = notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    );
    setNotifications(updatedNotifications);
    setUnreadCount(updatedNotifications.filter(n => !n.read).length);
    
    // Save to localStorage
    localStorage.setItem(`notifications_${user.id}`, JSON.stringify(updatedNotifications));
  };

  return (
    <div className="dashboard">
      <div className="container">
        {/* Header */}
        <div className="dashboard-header">
          <div className="user-info">
            <div className="user-avatar">
              <UserIcon size={24} />
            </div>
            <div>
              <h1>Welcome, {user.username}!</h1>
              <p>Your personal account</p>
            </div>
          </div>
          <div className="header-actions">
            <div className="notifications">
              <Bell size={24} />
              {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
            </div>
            <button onClick={onLogout} className="btn btn-secondary">
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>

        {/* Main Actions */}
        <div className="main-actions">
          <div className="action-cards">
            <Link to="/create-order" className="action-card">
              <div className="action-icon">
                <ShoppingCart size={48} />
              </div>
              <h3>Create order</h3>
              <p>Create a new order for the product you need</p>
            </Link>

            <Link to="/manufacturer-catalog" className="action-card">
              <div className="action-icon">
                <Package size={48} />
              </div>
              <h3>For manufacturers</h3>
              <p>View requests and offer your products</p>
            </Link>
          </div>
        </div>

        {/* Statistics */}
        <div className="stats-section">
          <div className="stats-grid">
            <div className="stat-card">
              <h3>My orders</h3>
              <div className="stat-number">{orders.length}</div>
              <p>Total orders created</p>
            </div>
            <div className="stat-card">
              <h3>Active orders</h3>
              <div className="stat-number">{orders.filter(o => o.status === 'active').length}</div>
              <p>Awaiting offers</p>
            </div>
            <div className="stat-card">
              <h3>Notifications</h3>
              <div className="stat-number">{unreadCount}</div>
              <p>Unread messages</p>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        {orders.length > 0 && (
          <div className="recent-orders">
            <h2>Recent orders</h2>
            <div className="orders-list">
              {orders.slice(0, 3).map(order => (
                <div key={order.id} className="order-card">
                  <div className="order-info">
                    <h4>{order.title}</h4>
                    <p>{order.description}</p>
                    <div className="order-meta">
                      <span className="order-status status-{order.status}">
                        {order.status === 'active' ? 'Active' :
                         order.status === 'completed' ? 'Completed' : 'Cancelled'}
                      </span>
                      <span className="order-date">
                        {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                  </div>
                  <div className="order-actions">
                    {order.offers && order.offers.length > 0 && (
                      <span className="offers-count">
                        {order.offers.length} offers
                      </span>
                    )}
                    <Link to={`/order/${order.id}`} className="btn btn-primary">
                      Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="notifications-section">
            <h2>Notifications</h2>
            <div className="notifications-list">
              {notifications.slice(0, 5).map(notification => (
                <div 
                  key={notification.id} 
                  className={`notification-item ${!notification.read ? 'unread' : ''}`}
                  onClick={() => markNotificationAsRead(notification.id)}
                >
                  <div className="notification-content">
                    <h4>{notification.title}</h4>
                    <p>{notification.message}</p>
                    <span className="notification-date">
                      {new Date(notification.createdAt).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                  {!notification.read && <div className="unread-indicator"></div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .dashboard {
          min-height: 100vh;
          padding: 40px 0;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          padding: 20px 0;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .user-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .user-info h1 {
          font-size: 1.8rem;
          color: white;
          margin: 0;
        }

        .user-info p {
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .notifications {
          position: relative;
          color: white;
          cursor: pointer;
        }

        .notification-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background: #e74c3c;
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
        }

        .main-actions {
          margin-bottom: 40px;
        }

        .action-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
        }

        .action-card {
          background: white;
          border-radius: 12px;
          padding: 30px;
          text-align: center;
          text-decoration: none;
          color: inherit;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .action-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
        }

        .action-icon {
          color: #667eea;
          margin-bottom: 20px;
        }

        .action-card h3 {
          font-size: 1.5rem;
          margin-bottom: 15px;
          color: #333;
        }

        .action-card p {
          color: #666;
          line-height: 1.6;
        }

        .stats-section {
          margin-bottom: 40px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          text-align: center;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .stat-card h3 {
          font-size: 1rem;
          color: #666;
          margin-bottom: 10px;
        }

        .stat-number {
          font-size: 2.5rem;
          font-weight: 700;
          color: #667eea;
          margin-bottom: 5px;
        }

        .stat-card p {
          color: #666;
          font-size: 0.9rem;
        }

        .recent-orders, .notifications-section {
          margin-bottom: 40px;
        }

        .recent-orders h2, .notifications-section h2 {
          color: white;
          margin-bottom: 20px;
          font-size: 1.5rem;
        }

        .orders-list, .notifications-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .order-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .notification-item {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .notification-item {
          cursor: pointer;
          position: relative;
        }

        .order-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 15px;
        }

        .notification-item.unread {
          border-left: 4px solid #667eea;
        }

        .order-info h4, .notification-content h4 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .order-info p, .notification-content p {
          margin: 0 0 10px 0;
          color: #666;
          line-height: 1.5;
        }

        .order-meta {
          display: flex;
          gap: 15px;
          align-items: center;
        }

        .order-status {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .status-active {
          background: #e8f5e8;
          color: #27ae60;
        }

        .status-completed {
          background: #e3f2fd;
          color: #1976d2;
        }

        .status-cancelled {
          background: #ffebee;
          color: #d32f2f;
        }

        .order-date, .notification-date {
          color: #999;
          font-size: 0.9rem;
        }

        .offers-count {
          background: #667eea;
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .unread-indicator {
          width: 8px;
          height: 8px;
          background: #667eea;
          border-radius: 50%;
        }

        @media (max-width: 768px) {
          .dashboard-header {
            flex-direction: column;
            gap: 20px;
            text-align: center;
          }

          .action-cards {
            grid-template-columns: 1fr;
          }

          .stats-grid {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
