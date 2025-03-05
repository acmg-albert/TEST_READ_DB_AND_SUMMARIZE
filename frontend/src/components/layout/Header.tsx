import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Image } from '@chakra-ui/react';

const Header: React.FC = () => {
  return (
    <div className="container-fluid nav-bar bg-transparent">
      <nav className="navbar navbar-expand-lg bg-white navbar-light py-0 px-4">
        <RouterLink to="/" className="navbar-brand d-flex align-items-center text-center">
          <div className="icon p-2 me-2">
            <Image className="img-fluid" src="/img/my-logo.png" alt="My Logo" style={{ width: '30px', height: '30px' }} />
          </div>
          <h1 className="m-0 text-primary">My Logo</h1>
        </RouterLink>
        
        <button type="button" className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarCollapse">
          <div className="navbar-nav ms-auto">
            <RouterLink to="/" className="nav-item nav-link">HOME</RouterLink>
            
            <div className="nav-item dropdown">
              <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">SALES MARKET</a>
              <div className="dropdown-menu rounded-0 m-0">
                <span className="dropdown-item">Under Construction</span>
              </div>
            </div>
            
            <div className="nav-item dropdown">
              <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">RENTAL MARKET</a>
              <div className="dropdown-menu rounded-0 m-0">
                <RouterLink to="/rental/apartments-rent" className="dropdown-item">Apartments Rent</RouterLink>
                <RouterLink to="/rental/apartments-vacancy" className="dropdown-item">Apartments Vacancy</RouterLink>
                <RouterLink to="/rental/apartments-vacancy-rev" className="dropdown-item">Apartments Vacancy Rev</RouterLink>
                <RouterLink to="/rental/time-on-market" className="dropdown-item">Apartments Time on Market</RouterLink>
              </div>
            </div>
            
            <div className="nav-item dropdown">
              <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">AFFORDABILITY</a>
              <div className="dropdown-menu rounded-0 m-0">
                <span className="dropdown-item">Under Construction</span>
              </div>
            </div>
            
            <RouterLink to="#" className="nav-item nav-link">NEW CONSTRUCTIONS</RouterLink>
            <RouterLink to="#" className="nav-item nav-link">ABOUT US</RouterLink>
          </div>
          
          <a href="#" className="btn btn-primary px-3 d-none d-lg-flex">Login/Sign up</a>
        </div>
      </nav>
    </div>
  );
};

export default Header; 