import React, { useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  useEffect(() => {
    // 在组件挂载后隐藏加载动画
    const spinner = document.getElementById('spinner');
    if (spinner) {
      spinner.classList.remove('show');
    }
  }, []);

  return (
    <Box className="container-xxl bg-white p-0">
      {/* Spinner Start */}
      <div id="spinner" className="show bg-white position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
      {/* Spinner End */}

      <Header />
      
      <Box as="main" className="container-fluid bg-white p-0" mt="72px">
        {children}
      </Box>
      
      <Footer />
    </Box>
  );
};

export default Layout; 