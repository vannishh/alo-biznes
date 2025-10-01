import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User } from '../types';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simple validation
    if (!formData.username || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    // User verification simulation
    setTimeout(() => {
      // Check if user exists in localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: User) =>
        u.username === formData.username &&
        u.password === formData.password
      );

      if (user) {
        // Remove password from user object before saving
        const { password, ...userWithoutPassword } = user;
        onLogin(userWithoutPassword as User);
      } else {
        setError('Invalid username or password');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <h1>Login</h1>
              <p>Sign in to your account to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="username" className="form-label">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter your username"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter your password"
                  required
                />
              </div>

              {error && <div className="error">{error}</div>}

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ width: '100%', marginTop: '20px' }}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                No account?{' '}
                <Link to="/register" className="auth-link">
                  Register
                </Link>
              </p>
              <p>
                <Link to="/" className="auth-link">
                  ← Return to home
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px 0;
        }

        .auth-container {
          width: 100%;
          max-width: 400px;
        }

        .auth-card {
          background: white;
          border-radius: 12px;
          padding: 40px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .auth-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .auth-header h1 {
          font-size: 2rem;
          color: #333;
          margin-bottom: 10px;
        }

        .auth-header p {
          color: #666;
          font-size: 1rem;
        }

        .auth-form {
          margin-bottom: 30px;
        }

        .auth-footer {
          text-align: center;
        }

        .auth-footer p {
          margin-bottom: 10px;
          color: #666;
        }

        .auth-link {
          color: #667eea;
          text-decoration: none;
          font-weight: 600;
        }

        .auth-link:hover {
          text-decoration: underline;
        }

        @media (max-width: 480px) {
          .auth-card {
            padding: 30px 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
