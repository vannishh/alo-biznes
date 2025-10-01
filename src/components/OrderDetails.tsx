import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Order, Offer } from '../types';
import { getOrders, getOffers } from '../data/mockData.ts';
import { ArrowLeft, Package, CheckCircle, XCircle, Eye } from 'lucide-react';

interface OrderDetailsProps {
  user: User;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ user }) => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{action: 'accept' | 'reject', offer: Offer} | null>(null);

  useEffect(() => {
    if (orderId) {
      const orders = getOrders();
      const foundOrder = orders.find(o => o.id === orderId);
      if (foundOrder) {
        setOrder(foundOrder);
        
        // Загружаем предложения для этого заказа
        const allOffers = getOffers();
        const orderOffers = allOffers.filter(o => o.orderId === orderId);
        setOffers(orderOffers);
      }
    }
  }, [orderId]);

  const handleAcceptOffer = (offer: Offer) => {
    setConfirmAction({ action: 'accept', offer });
    setShowConfirmModal(true);
  };

  const handleRejectOffer = (offer: Offer) => {
    setConfirmAction({ action: 'reject', offer });
    setShowConfirmModal(true);
  };

  const handleConfirmAccept = (offer: Offer) => {
    setShowConfirmModal(false);
    alert('Delivery cannot be made at the moment. In the future, there will be integration with the delivery and payment system here.');
  };

  const handleConfirmReject = (offer: Offer) => {
    setShowConfirmModal(false);
    // In a real application, the offer status will be updated here
    alert('Offer rejected');
  };

  if (!order) {
    return (
      <div className="order-details">
        <div className="container">
          <div className="error-message">
            <h2>Order not found</h2>
            <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
              Return to account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-details">
      <div className="container">
        <div className="page-header">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="back-btn"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <h1>Order details</h1>
        </div>

        <div className="order-info">
          <div className="order-card">
            <div className="order-header">
              <h2>{order.title}</h2>
              <div className="order-status">
                <span className={`status-badge status-${order.status}`}>
                  {order.status === 'active' ? 'Active' :
                   order.status === 'completed' ? 'Completed' : 'Cancelled'}
                </span>
              </div>
            </div>
            
            <div className="order-description">
              <h3>Description</h3>
              <p>{order.description}</p>
            </div>

            <div className="order-filters">
              <h3>Requirements</h3>
              <div className="filters-list">
                {order.filters.price && (
                  <div className="filter-item">
                    <strong>Price:</strong> {order.filters.price.min ? `${order.filters.price.min}BYN` : '0BYN'} - {order.filters.price.max ? `${order.filters.price.max}BYN` : '∞BYN'}
                  </div>
                )}
                {order.filters.color && (
                  <div className="filter-item">
                    <strong>Color:</strong> {order.filters.color}
                  </div>
                )}
                {order.filters.size && (
                  <div className="filter-item">
                    <strong>Size:</strong> {order.filters.size}
                  </div>
                )}
              </div>
            </div>

            <div className="order-meta">
              <p><strong>Created:</strong> {new Date(order.createdAt).toLocaleDateString('en-US')}</p>
              <p><strong>Offers:</strong> {offers.length}</p>
            </div>
          </div>
        </div>

        <div className="offers-section">
          <h2>Manufacturer offers</h2>
          
          {offers.length === 0 ? (
            <div className="no-offers">
              <Package size={64} />
              <h3>No offers yet</h3>
              <p>Manufacturers have not responded to your order yet</p>
            </div>
          ) : (
            <div className="offers-list">
              {offers.map(offer => (
                <div key={offer.id} className="offer-card">
                  <div className="offer-header">
                    <div className="manufacturer-info">
                      <h3>From: {offer.manufacturerUsername}</h3>
                      <span className="offer-date">
                        {new Date(offer.createdAt).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                    <div className="offer-price">
                      <span className="price">{offer.price}BYN</span>
                    </div>
                  </div>

                  <div className="offer-content">
                    <div className="offer-description">
                      <h4>Product description</h4>
                      <p>{offer.description}</p>
                    </div>

                    <div className="offer-characteristics">
                      <h4>Characteristics</h4>
                      <p>{offer.characteristics}</p>
                    </div>

                    {offer.images.length > 0 && (
                      <div className="offer-images">
                        <h4>Photos</h4>
                        <div className="images-grid">
                          {offer.images.map((image, index) => (
                            <img 
                              key={index} 
                              src={image}
                              alt={`Product ${index + 1}`}
                              className="offer-image"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="offer-actions">
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        setSelectedOffer(offer);
                        setShowOfferModal(true);
                      }}
                    >
                      <Eye size={20} />
                      Details
                    </button>
                    
                    <div className="action-buttons">
                      <button
                        className="btn btn-success"
                        onClick={() => handleAcceptOffer(offer)}
                      >
                        <CheckCircle size={20} />
                        Accept
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleRejectOffer(offer)}
                      >
                        <XCircle size={20} />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Offer Details Modal */}
      {showOfferModal && selectedOffer && (
        <div className="modal">
          <div className="modal-content">
            <button 
              className="close-btn"
              onClick={() => setShowOfferModal(false)}
            >
              ×
            </button>
            
            <h2>Offer details</h2>
            
            <div className="offer-details">
              <div className="detail-section">
                <h3>Manufacturer</h3>
                <p>{selectedOffer.manufacturerUsername}</p>
              </div>

              <div className="detail-section">
                <h3>Цена</h3>
                <p className="price-large">{selectedOffer.price}BYN</p>
              </div>

              <div className="detail-section">
                <h3>Product description</h3>
                <p>{selectedOffer.description}</p>
              </div>

              <div className="detail-section">
                <h3>Characteristics</h3>
                <p>{selectedOffer.characteristics}</p>
              </div>

              {selectedOffer.images.length > 0 && (
                <div className="detail-section">
                  <h3>Photos</h3>
                  <div className="images-grid">
                    {selectedOffer.images.map((image, index) => (
                      <img 
                        key={index} 
                        src={image}
                        alt={`Product ${index + 1}`}
                        className="detail-image"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setShowOfferModal(false)}
              >
                Close
              </button>
              <button
                className="btn btn-success"
                onClick={() => {
                  setShowOfferModal(false);
                  handleAcceptOffer(selectedOffer);
                }}
              >
                Accept offer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && confirmAction && (
        <div className="modal">
          <div className="modal-content">
            <button
              className="close-btn"
              onClick={() => setShowConfirmModal(false)}
            >
              ×
            </button>
            
            <h2>Confirm action</h2>
            
            <div className="confirm-message">
              <p>
                {confirmAction.action === 'accept'
                  ? `Are you sure you want to accept the offer from ${confirmAction.offer.manufacturerUsername} for ${confirmAction.offer.price}BYN?`
                  : `Reject offer from ${confirmAction.offer.manufacturerUsername}?`}
              </p>
            </div>
            
            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </button>
              <button
                className={`btn ${confirmAction.action === 'accept' ? 'btn-success' : 'btn-danger'}`}
                onClick={() => {
                  if (confirmAction.action === 'accept') {
                    handleConfirmAccept(confirmAction.offer);
                  } else {
                    handleConfirmReject(confirmAction.offer);
                  }
                }}
              >
                {confirmAction.action === 'accept' ? 'Accept' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .order-details {
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

        .error-message {
          text-align: center;
          color: white;
          padding: 60px 20px;
        }

        .order-info {
          margin-bottom: 40px;
        }

        .order-card {
          background: white;
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .order-header h2 {
          font-size: 1.8rem;
          color: #333;
          margin: 0;
        }

        .status-badge {
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 0.9rem;
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

        .order-description,
        .order-filters {
          margin-bottom: 25px;
        }

        .order-description h3,
        .order-filters h3 {
          font-size: 1.2rem;
          color: #333;
          margin-bottom: 10px;
        }

        .order-description p {
          color: #666;
          line-height: 1.6;
        }

        .filters-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .filter-item {
          color: #666;
        }

        .order-meta {
          border-top: 1px solid #eee;
          padding-top: 20px;
        }

        .order-meta p {
          margin: 5px 0;
          color: #666;
        }

        .offers-section h2 {
          color: white;
          margin-bottom: 20px;
          font-size: 1.5rem;
        }

        .no-offers {
          text-align: center;
          padding: 60px 20px;
          color: white;
        }

        .no-offers svg {
          margin-bottom: 20px;
          opacity: 0.5;
        }

        .no-offers h3 {
          font-size: 1.5rem;
          margin-bottom: 10px;
        }

        .no-offers p {
          opacity: 0.8;
        }

        .offers-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .offer-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .offer-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .manufacturer-info h3 {
          font-size: 1.3rem;
          color: #333;
          margin: 0 0 5px 0;
        }

        .offer-date {
          color: #666;
          font-size: 0.9rem;
        }

        .offer-price {
          text-align: right;
        }

        .price {
          font-size: 1.5rem;
          font-weight: 700;
          color: #27ae60;
        }

        .offer-content {
          margin-bottom: 20px;
        }

        .offer-description,
        .offer-characteristics,
        .offer-images {
          margin-bottom: 20px;
        }

        .offer-description h4,
        .offer-characteristics h4,
        .offer-images h4 {
          font-size: 1.1rem;
          color: #333;
          margin-bottom: 10px;
        }

        .offer-description p,
        .offer-characteristics p {
          color: #666;
          line-height: 1.6;
        }

        .images-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 15px;
        }

        .offer-image,
        .detail-image {
          width: 100%;
          height: 150px;
          object-fit: cover;
          border-radius: 8px;
        }

        .offer-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid #eee;
          padding-top: 20px;
        }

        .action-buttons {
          display: flex;
          gap: 10px;
        }

        .btn-success {
          background: #27ae60;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: background 0.3s ease;
        }

        .btn-success:hover {
          background: #219a52;
        }

        .btn-danger {
          background: #e74c3c;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: background 0.3s ease;
        }

        .btn-danger:hover {
          background: #c0392b;
        }

        .offer-details {
          max-height: 60vh;
          overflow-y: auto;
          margin-bottom: 20px;
        }

        .detail-section {
          margin-bottom: 25px;
        }

        .detail-section h3 {
          font-size: 1.2rem;
          color: #333;
          margin-bottom: 10px;
        }

        .detail-section p {
          color: #666;
          line-height: 1.6;
        }

        .price-large {
          font-size: 1.8rem;
          font-weight: 700;
          color: #27ae60;
        }

        .modal-actions {
          display: flex;
          gap: 15px;
          justify-content: flex-end;
        }

        @media (max-width: 768px) {
          .offer-header {
            flex-direction: column;
            gap: 15px;
          }

          .offer-actions {
            flex-direction: column;
            gap: 15px;
          }

          .action-buttons {
            width: 100%;
            justify-content: space-between;
          }

          .modal-actions {
            flex-direction: column;
          }
        }
        
        .confirm-message {
          margin: 20px 0;
          padding: 15px;
          background-color: #f8f9fa;
          border-radius: 8px;
        }
        
        .confirm-message p {
          margin: 0;
          font-size: 1.1rem;
          color: #333;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default OrderDetails;
