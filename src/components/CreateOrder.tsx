import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Order } from '../types';
import { getOrders, saveOrders } from '../data/mockData.ts';
import { ArrowLeft, Plus } from 'lucide-react';

interface CreateOrderProps {
  user: User;
}

const CreateOrder: React.FC<CreateOrderProps> = ({ user }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priceMin: '',
    priceMax: '',
    color: '',
    size: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

    // Валидация
    if (!formData.title.trim()) {
      setError('Product name is required');
      setLoading(false);
      return;
    }

    if (!formData.description.trim()) {
      setError('Product description is required');
      setLoading(false);
      return;
    }

    // Создаем новый заказ
    const newOrder: Order = {
      id: Date.now().toString(),
      userId: user.id,
      title: formData.title.trim(),
      description: formData.description.trim(),
      filters: {
        price: {
          min: formData.priceMin ? parseInt(formData.priceMin) : undefined,
          max: formData.priceMax ? parseInt(formData.priceMax) : undefined
        },
        color: formData.color || undefined,
        size: formData.size || undefined
      },
      status: 'active',
      createdAt: new Date().toISOString(),
      offers: []
    };

    // Сохраняем заказ
    const orders = getOrders();
    orders.push(newOrder);
    saveOrders(orders);

    // Перенаправляем на дашборд
    navigate('/dashboard');
  };

  return (
    <div className="create-order">
      <div className="container">
        <div className="page-header">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="back-btn"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <h1>Create order</h1>
        </div>

        <div className="form-container">
          <div className="form-card">
            <div className="form-header">
              <h2>Describe the product you need</h2>
              <p>The more detailed the description, the better manufacturers can offer a suitable product</p>
            </div>

            <form onSubmit={handleSubmit} className="order-form">
              <div className="form-group">
                <label htmlFor="title" className="form-label">
                  Product name *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="For example: Nike sneakers, iPhone smartphone, Winter jacket"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description" className="form-label">
                  Product description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-textarea"
                  placeholder="Describe in detail what you want from the product: size, color, condition, features, what the product is for, etc."
                  required
                />
              </div>

              <div className="filters-section">
                <h3>Filters (optional)</h3>
                <p>Specify preferences so manufacturers can better select a product</p>
                
                <div className="filters-grid">
                  <div className="form-group">
                    <label htmlFor="priceMin" className="form-label">
                      Minimum price (BYN)
                    </label>
                    <input
                      type="number"
                      id="priceMin"
                      name="priceMin"
                      value={formData.priceMin}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="0"
                      min="0"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="priceMax" className="form-label">
                      Maximum price (BYN)
                    </label>
                    <input
                      type="number"
                      id="priceMax"
                      name="priceMax"
                      value={formData.priceMax}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="100000"
                      min="0"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="color" className="form-label">
                      Color
                    </label>
                    <select
                      id="color"
                      name="color"
                      value={formData.color}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="">Any color</option>
                      <option value="black">Black</option>
                      <option value="white">White</option>
                      <option value="gray">Gray</option>
                      <option value="red">Red</option>
                      <option value="blue">Blue</option>
                      <option value="green">Green</option>
                      <option value="yellow">Yellow</option>
                      <option value="brown">Brown</option>
                      <option value="pink">Pink</option>
                      <option value="purple">Purple</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="size" className="form-label">
                      Size
                    </label>
                    <select
                      id="size"
                      name="size"
                      value={formData.size}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="">Any size</option>
                      <option value="XS">XS</option>
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                      <option value="XXL">XXL</option>
                      <option value="36">36</option>
                      <option value="37">37</option>
                      <option value="38">38</option>
                      <option value="39">39</option>
                      <option value="40">40</option>
                      <option value="41">41</option>
                      <option value="42">42</option>
                      <option value="43">43</option>
                      <option value="44">44</option>
                      <option value="45">45</option>
                    </select>
                  </div>
                </div>
              </div>

              {error && <div className="error">{error}</div>}

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        .create-order {
          min-height: 100vh;
          padding: 40px 0;
        }

        .page-header {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 30px;
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .back-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .page-header h1 {
          color: white;
          font-size: 2rem;
          margin: 0;
        }

        .form-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .form-card {
          background: white;
          border-radius: 12px;
          padding: 40px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .form-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .form-header h2 {
          font-size: 1.8rem;
          color: #333;
          margin-bottom: 10px;
        }

        .form-header p {
          color: #666;
          line-height: 1.6;
        }

        .order-form {
          max-width: 600px;
          margin: 0 auto;
        }

        .filters-section {
          margin: 40px 0;
          padding: 30px;
          background: #f8f9fa;
          border-radius: 12px;
        }

        .filters-section h3 {
          font-size: 1.3rem;
          color: #333;
          margin-bottom: 10px;
        }

        .filters-section p {
          color: #666;
          margin-bottom: 20px;
          font-size: 0.9rem;
        }

        .filters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .form-actions {
          display: flex;
          gap: 20px;
          justify-content: center;
          margin-top: 40px;
        }

        .form-actions .btn {
          min-width: 150px;
        }

        @media (max-width: 768px) {
          .form-card {
            padding: 30px 20px;
          }

          .filters-grid {
            grid-template-columns: 1fr;
          }

          .form-actions {
            flex-direction: column;
          }

          .form-actions .btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default CreateOrder;
