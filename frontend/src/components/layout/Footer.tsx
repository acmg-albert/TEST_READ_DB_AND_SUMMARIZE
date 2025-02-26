import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <div className="container-fluid bg-dark text-white-50 footer pt-5 mt-5 wow fadeIn" data-wow-delay="0.1s">
      <div className="container py-5">
        <div className="row g-5">
          {/* Get In Touch Section */}
          <div className="col-lg-3 col-md-6">
            <h5 className="text-white mb-4">Get In Touch</h5>
            <p className="mb-2"><i className="fa fa-map-marker-alt me-3"></i>123 Street, New York, USA</p>
            <p className="mb-2"><i className="fa fa-phone-alt me-3"></i>+012 345 67890</p>
            <p className="mb-2"><i className="fa fa-envelope me-3"></i>info@example.com</p>
            <div className="d-flex pt-2">
              <a className="btn btn-outline-light btn-social" href="#"><i className="fab fa-twitter"></i></a>
              <a className="btn btn-outline-light btn-social" href="#"><i className="fab fa-facebook-f"></i></a>
              <a className="btn btn-outline-light btn-social" href="#"><i className="fab fa-youtube"></i></a>
              <a className="btn btn-outline-light btn-social" href="#"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="col-lg-3 col-md-6">
            <h5 className="text-white mb-4">Quick Links</h5>
            <RouterLink to="/" className="btn btn-link text-white-50">Home</RouterLink>
            <RouterLink to="/about" className="btn btn-link text-white-50">About Us</RouterLink>
            <RouterLink to="/rental/apartments-rent" className="btn btn-link text-white-50">Rental Market</RouterLink>
            <RouterLink to="/sales-market" className="btn btn-link text-white-50">Sales Market</RouterLink>
            <RouterLink to="/affordability" className="btn btn-link text-white-50">Affordability</RouterLink>
          </div>

          {/* Photo Gallery Section */}
          <div className="col-lg-3 col-md-6">
            <h5 className="text-white mb-4">Photo Gallery</h5>
            <div className="row g-2 pt-2">
              <div className="col-4">
                <img className="img-fluid rounded bg-light p-1" src="/img/property-1.jpg" alt="" />
              </div>
              <div className="col-4">
                <img className="img-fluid rounded bg-light p-1" src="/img/property-2.jpg" alt="" />
              </div>
              <div className="col-4">
                <img className="img-fluid rounded bg-light p-1" src="/img/property-3.jpg" alt="" />
              </div>
              <div className="col-4">
                <img className="img-fluid rounded bg-light p-1" src="/img/property-4.jpg" alt="" />
              </div>
              <div className="col-4">
                <img className="img-fluid rounded bg-light p-1" src="/img/property-5.jpg" alt="" />
              </div>
              <div className="col-4">
                <img className="img-fluid rounded bg-light p-1" src="/img/property-6.jpg" alt="" />
              </div>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="col-lg-3 col-md-6">
            <h5 className="text-white mb-4">Newsletter</h5>
            <p>Subscribe to our newsletter to receive the latest updates and news.</p>
            <div className="position-relative mx-auto" style={{ maxWidth: '400px' }}>
              <input className="form-control bg-transparent w-100 py-3 ps-4 pe-5" type="text" placeholder="Your email" />
              <button type="button" className="btn btn-primary py-2 position-absolute top-0 end-0 mt-2 me-2">Sign Up</button>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="container">
        <div className="copyright">
          <div className="row">
            <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
              &copy; <a className="border-bottom" href="#">Real Estate Market Data</a>, All Right Reserved.
            </div>
            <div className="col-md-6 text-center text-md-end">
              <div className="footer-menu">
                <RouterLink to="/">Home</RouterLink>
                <RouterLink to="/about">About</RouterLink>
                <RouterLink to="/help">Help</RouterLink>
                <RouterLink to="/faq">FAQs</RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer; 