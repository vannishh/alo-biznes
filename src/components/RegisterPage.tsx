import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User } from '../types';

interface RegisterPageProps {
  onLogin: (user: User) => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(false);

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must contain at least 8 characters');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one digit');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    return errors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    // Clear errors when fields change
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Валидация
    const newErrors: {[key: string]: string} = {};

    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must contain at least 3 characters';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      const passwordErrors = validatePassword(formData.password);
      if (passwordErrors.length > 0) {
        newErrors.password = passwordErrors[0];
      }
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Password confirmation is required';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    // Проверяем, не существует ли уже такой пользователь
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const existingUser = users.find((u: User) => u.username === formData.username);

    if (existingUser) {
      setErrors({ username: 'User with this username already exists' });
      setLoading(false);
      return;
    }

    // User creation simulation
    setTimeout(() => {
      const newUser: User = {
        id: Date.now().toString(),
        username: formData.username,
        password: formData.password, // In a real application, the password should be hashed
        role: 'buyer',
        createdAt: new Date().toISOString()
      };

      // Save the user
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));

      // Remove password from user object before saving
      const { password, ...userWithoutPassword } = newUser;
      onLogin(userWithoutPassword as User);
    }, 1000);
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <h1>Registration</h1>
              <p>Create a new account to start shopping</p>
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
                  placeholder="Enter username (at least 3 characters)"
                  required
                />
                {errors.username && <div className="error">{errors.username}</div>}
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
                  placeholder="Enter password"
                  required
                />
                {errors.password && <div className="error">{errors.password}</div>}
                <div className="password-requirements">
                  <small>Password requirements:</small>
                  <ul>
                    <li>At least 8 characters</li>
                    <li>Uppercase letter</li>
                    <li>Lowercase letter</li>
                    <li>Digit</li>
                    <li>Special character</li>
                  </ul>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  Password confirmation
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Repeat password"
                  required
                />
                {errors.confirmPassword && <div className="error">{errors.confirmPassword}</div>}
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ width: '100%', marginTop: '20px' }}
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                Already have an account?{' '}
                <Link to="/login" className="auth-link">
                  Login
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

        .password-requirements {
          margin-top: 10px;
          padding: 10px;
          background: #f8f9fa;
          border-radius: 6px;
          font-size: 0.9rem;
        }

        .password-requirements small {
          font-weight: 600;
          color: #666;
        }

        .password-requirements ul {
          margin: 5px 0 0 0;
          padding-left: 20px;
          color: #666;
        }

        .password-requirements li {
          margin-bottom: 2px;
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

export default RegisterPage;
