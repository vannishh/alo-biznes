import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Order, Offer } from '../types';
import { getOrders, getOffers, saveOffers } from '../data/mockData.ts';
import { ArrowLeft, Search, Filter, Package, Clock } from 'lucide-react';

interface ManufacturerCatalogProps {
  user: User;
}

const ManufacturerCatalog: React.FC<ManufacturerCatalogProps> = ({ user }) => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState({ min: '', max: '' });
  const [colorFilter, setColorFilter] = useState('');
  const [sizeFilter, setSizeFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerForm, setOfferForm] = useState({
    price: '',
    description: '',
    characteristics: '',
    images: [] as string[]
  });

  useEffect(() => {
    const allOrders = getOrders().filter(order => order.status === 'active');
    setOrders(allOrders);
    setFilteredOrders(allOrders);
  }, []);

  useEffect(() => {
    let filtered = orders;

    // Поиск по названию и описанию
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Фильтр по цене
    if (priceFilter.min) {
      filtered = filtered.filter(order => {
        const minPrice = parseInt(priceFilter.min);
        return order.filters.price?.min ? order.filters.price.min >= minPrice : true;
      });
    }

    if (priceFilter.max) {
      filtered = filtered.filter(order => {
        const maxPrice = parseInt(priceFilter.max);
        return order.filters.price?.max ? order.filters.price.max <= maxPrice : true;
      });
    }

    // Фильтр по цвету
    if (colorFilter) {
      filtered = filtered.filter(order =>
        !order.filters.color || order.filters.color === colorFilter
      );
    }

    // Фильтр по размеру
    if (sizeFilter) {
      filtered = filtered.filter(order =>
        !order.filters.size || order.filters.size === sizeFilter
      );
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, priceFilter, colorFilter, sizeFilter]);

  const handleOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedOrder) return;

    const newOffer: Offer = {
      id: Date.now().toString(),
      orderId: selectedOrder.id,
      manufacturerId: user.id,
      manufacturerUsername: user.username,
      price: parseInt(offerForm.price),
      description: offerForm.description,
      images: offerForm.images,
      characteristics: offerForm.characteristics,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const offers = getOffers();
    offers.push(newOffer);
    saveOffers(offers);

    // Закрываем модальное окно и сбрасываем форму
    setShowOfferModal(false);
    setSelectedOrder(null);
    setOfferForm({
      price: '',
      description: '',
      characteristics: '',
      images: []
    });

    alert('Offer sent! The buyer will receive a notification.');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const imageUrls = Array.from(files).map(file => URL.createObjectURL(file));
      setOfferForm({
        ...offerForm,
        images: [...offerForm.images, ...imageUrls]
      });
    }
  };

  return (
    <div className="manufacturer-catalog">
      <div className="container">
        <div className="page-header">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="back-btn"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <h1>Offers catalog</h1>
        </div>

        {/* Search and Filters */}
        <div className="search-filters">
          <div className="search-bar">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search by product name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button 
            className="filter-btn"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={20} />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="filters-panel">
            <div className="filter-group">
              <label>Price from:</label>
              <input
                type="number"
                placeholder="0"
                value={priceFilter.min}
                onChange={(e) => setPriceFilter({...priceFilter, min: e.target.value})}
              />
            </div>
            <div className="filter-group">
              <label>Price to:</label>
              <input
                type="number"
                placeholder="100000"
                value={priceFilter.max}
                onChange={(e) => setPriceFilter({...priceFilter, max: e.target.value})}
              />
            </div>
            <div className="filter-group">
              <label>Color:</label>
              <select
                value={colorFilter}
                onChange={(e) => setColorFilter(e.target.value)}
              >
                <option value="">Any</option>
                <option value="black">Black</option>
                <option value="white">White</option>
                <option value="gray">Gray</option>
                <option value="red">Red</option>
                <option value="blue">Blue</option>
                <option value="green">Green</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Size:</label>
              <select
                value={sizeFilter}
                onChange={(e) => setSizeFilter(e.target.value)}
              >
                <option value="">Any</option>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="42">42</option>
                <option value="43">43</option>
                <option value="44">44</option>
              </select>
            </div>
          </div>
        )}

        {/* Orders List */}
        <div className="orders-grid">
          {filteredOrders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <h3>{order.title}</h3>
                <div className="order-meta">
                  <span className="order-date">
                    <Clock size={16} />
                    {new Date(order.createdAt).toLocaleDateString('en-US')}
                  </span>
                </div>
              </div>
              
              <div className="order-description">
                <p>{order.description}</p>
              </div>

              <div className="order-filters">
                {order.filters.price && (
                  <div className="filter-tag">
                    Price: {order.filters.price.min ? `${order.filters.price.min}BYN` : '0BYN'} - {order.filters.price.max ? `${order.filters.price.max}BYN` : '∞BYN'}
                  </div>
                )}
                {order.filters.color && (
                  <div className="filter-tag">Color: {order.filters.color}</div>
                )}
                {order.filters.size && (
                  <div className="filter-tag">Size: {order.filters.size}</div>
                )}
              </div>

              <div className="order-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setSelectedOrder(order);
                    setShowOfferModal(true);
                  }}
                >
                  <Package size={20} />
                  Offer
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="no-orders">
            <Package size={64} />
            <h3>Requests not found</h3>
            <p>Try changing search parameters or filters</p>
          </div>
        )}
      </div>

      {/* Offer Modal */}
      {showOfferModal && selectedOrder && (
        <div className="modal">
          <div className="modal-content">
            <button 
              className="close-btn"
              onClick={() => setShowOfferModal(false)}
            >
              ×
            </button>
            
            <h2>Offer product</h2>
            <p>Order: <strong>{selectedOrder.title}</strong></p>
            
            <form onSubmit={handleOfferSubmit} className="offer-form">
              <div className="form-group">
                <label className="form-label">Price (BYN) *</label>
                <input
                  type="number"
                  className="form-input"
                  value={offerForm.price}
                  onChange={(e) => setOfferForm({...offerForm, price: e.target.value})}
                  placeholder="Enter price"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Product description *</label>
                <textarea
                  className="form-textarea"
                  value={offerForm.description}
                  onChange={(e) => setOfferForm({...offerForm, description: e.target.value})}
                  placeholder="Describe your product in detail, its condition, features"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Characteristics *</label>
                <textarea
                  className="form-textarea"
                  value={offerForm.characteristics}
                  onChange={(e) => setOfferForm({...offerForm, characteristics: e.target.value})}
                  placeholder="Size, color, material, condition, equipment, etc."
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Product photos</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="form-input"
                />
                {offerForm.images.length > 0 && (
                  <div className="image-preview">
                    {offerForm.images.map((url, index) => (
                      <img key={index} src={url} alt={`Preview ${index}`} />
                    ))}
                  </div>
                )}
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowOfferModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Send offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .manufacturer-catalog {
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

        .search-filters {
          display: flex;
          gap: 20px;
          margin-bottom: 30px;
          align-items: center;
        }

        .search-bar {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-bar svg {
          position: absolute;
          left: 15px;
          color: #666;
        }

        .search-bar input {
          width: 100%;
          padding: 12px 15px 12px 45px;
          border: 2px solid #e1e5e9;
          border-radius: 8px;
          font-size: 16px;
        }

        .filter-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: white;
          color: #667eea;
          border: 2px solid #667eea;
          padding: 12px 20px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .filter-btn:hover {
          background: #667eea;
          color: white;
        }

        .filters-panel {
          background: white;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 30px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .filter-group label {
          font-weight: 600;
          color: #333;
        }

        .filter-group input,
        .filter-group select {
          padding: 8px 12px;
          border: 2px solid #e1e5e9;
          border-radius: 6px;
        }

        .orders-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 20px;
        }

        .order-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }

        .order-card:hover {
          transform: translateY(-2px);
        }

        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 15px;
        }

        .order-header h3 {
          font-size: 1.3rem;
          color: #333;
          margin: 0;
        }

        .order-meta {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #666;
          font-size: 0.9rem;
        }

        .order-description {
          margin-bottom: 20px;
        }

        .order-description p {
          color: #666;
          line-height: 1.6;
        }

        .order-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 20px;
        }

        .filter-tag {
          background: #f0f0f0;
          color: #666;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
        }

        .order-actions {
          display: flex;
          justify-content: flex-end;
        }

        .no-orders {
          text-align: center;
          padding: 60px 20px;
          color: white;
        }

        .no-orders svg {
          margin-bottom: 20px;
          opacity: 0.5;
        }

        .no-orders h3 {
          font-size: 1.5rem;
          margin-bottom: 10px;
        }

        .no-orders p {
          opacity: 0.8;
        }

        .offer-form {
          max-width: 500px;
          margin: 0 auto;
        }

        .image-preview {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
          gap: 10px;
          margin-top: 10px;
        }

        .image-preview img {
          width: 100%;
          height: 100px;
          object-fit: cover;
          border-radius: 8px;
        }

        @media (max-width: 768px) {
          .search-filters {
            flex-direction: column;
          }

          .orders-grid {
            grid-template-columns: 1fr;
          }

          .filters-panel {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default ManufacturerCatalog;
