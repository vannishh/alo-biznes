import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Truck, Star, Users, Lock, Zap } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Alo Biznes
              <span className="hero-subtitle">Anonymous purchases with blockchain technology</span>
            </h1>
            <p className="hero-description">
              The world's first platform for completely anonymous purchases.
              No emails, passport data or personal information.
              Only login and password. Works like blockchain.
            </p>
            <div className="hero-buttons">
              <Link to="/register" className="btn btn-primary">
                Start shopping
              </Link>
              <Link to="/login" className="btn btn-secondary">
                Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Why choose us?</h2>
          <div className="grid grid-3">
            <div className="feature-card">
              <div className="feature-icon">
                <Shield size={48} />
              </div>
              <h3>Complete anonymity</h3>
              <p>No personal data. Only login and password to access the system.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Truck size={48} />
              </div>
              <h3>Reliable delivery</h3>
              <p>We care about delivery quality and check all product senders.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Star size={48} />
              </div>
              <h3>Rating system</h3>
              <p>Buyer ratings help maintain high product quality.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Users size={48} />
              </div>
              <h3>Verified manufacturers</h3>
              <p>All sellers undergo thorough verification before being admitted to the platform.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Lock size={48} />
              </div>
              <h3>Blockchain technology</h3>
              <p>Security and transparency of transactions are ensured by modern technologies.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Zap size={48} />
              </div>
              <h3>Fast transactions</h3>
              <p>Instant order placement and quick offer processing.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">How it works?</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Create an order</h3>
              <p>Describe the product you want to buy, specify the desired characteristics and price.</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Get offers</h3>
              <p>Manufacturers will offer their products with photos and characteristics.</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Choose the best</h3>
              <p>Compare offers and choose the most suitable option.</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Receive the product</h3>
              <p>Pay for the order and receive the product with a quality and anonymity guarantee.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to start anonymous shopping?</h2>
            <p>Join thousands of users who have already appreciated the advantages of our platform.</p>
            <Link to="/register" className="btn btn-primary">
              Register now
            </Link>
          </div>
        </div>
      </section>

      <style jsx>{`
        .landing-page {
          min-height: 100vh;
        }

        .hero {
          padding: 100px 0;
          text-align: center;
          color: white;
        }

        .hero-content {
          max-width: 800px;
          margin: 0 auto;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 700;
          margin-bottom: 20px;
          line-height: 1.2;
        }

        .hero-subtitle {
          display: block;
          font-size: 1.5rem;
          font-weight: 400;
          margin-top: 10px;
          opacity: 0.9;
        }

        .hero-description {
          font-size: 1.2rem;
          margin-bottom: 40px;
          line-height: 1.6;
          opacity: 0.9;
        }

        .hero-buttons {
          display: flex;
          gap: 20px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .features {
          padding: 80px 0;
          background: white;
        }

        .section-title {
          text-align: center;
          font-size: 2.5rem;
          margin-bottom: 60px;
          color: #333;
        }

        .feature-card {
          text-align: center;
          padding: 30px 20px;
          border-radius: 12px;
          background: #f8f9fa;
          transition: transform 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-5px);
        }

        .feature-icon {
          color: #667eea;
          margin-bottom: 20px;
        }

        .feature-card h3 {
          font-size: 1.5rem;
          margin-bottom: 15px;
          color: #333;
        }

        .feature-card p {
          color: #666;
          line-height: 1.6;
        }

        .how-it-works {
          padding: 80px 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .steps {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 40px;
          margin-top: 60px;
        }

        .step {
          text-align: center;
        }

        .step-number {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: white;
          color: #667eea;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0 auto 20px;
        }

        .step h3 {
          font-size: 1.5rem;
          margin-bottom: 15px;
        }

        .step p {
          opacity: 0.9;
          line-height: 1.6;
        }

        .cta {
          padding: 80px 0;
          background: white;
          text-align: center;
        }

        .cta-content {
          max-width: 600px;
          margin: 0 auto;
        }

        .cta h2 {
          font-size: 2.5rem;
          margin-bottom: 20px;
          color: #333;
        }

        .cta p {
          font-size: 1.2rem;
          color: #666;
          margin-bottom: 40px;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }
          
          .hero-subtitle {
            font-size: 1.2rem;
          }
          
          .hero-buttons {
            flex-direction: column;
            align-items: center;
          }
          
          .section-title {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
