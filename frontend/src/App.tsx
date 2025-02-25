import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import Layout from './components/layout/Layout';
import theme from './theme';
import styledTheme from './theme/styled';

// 导入现有的租金数据页面
import { SummaryPage as RentSummary } from './pages/RentalMarket/RentSummary';
import { LocationDetailPage as RentDetail } from './pages/RentalMarket/RentDetail';

// 创建 MUI 主题
const muiTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2196F3',
      light: '#64B5F6',
      dark: '#1976D2',
      contrastText: '#fff',
    },
    secondary: {
      main: '#f50057',
      light: '#ff4081',
      dark: '#c51162',
      contrastText: '#fff',
    },
    error: {
      main: '#f44336',
      light: '#e57373',
      dark: '#d32f2f',
      contrastText: '#fff',
    },
    warning: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57c00',
      contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    info: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
      contrastText: '#fff',
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
      contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    background: {
      paper: '#fff',
      default: '#fafafa',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: '#2196F3',
        },
      },
    },
  },
});

// 临时的占位页面组件
const UnderConstruction = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h2>🚧 Under Construction 🚧</h2>
    <p>This page is currently being developed.</p>
  </div>
);

function App() {
  return (
    <ChakraProvider theme={theme}>
      <MUIThemeProvider theme={muiTheme}>
        <StyledThemeProvider theme={styledTheme}>
          <CssBaseline />
          <Router>
            <Layout>
              <Routes>
                {/* 主页 */}
                <Route path="/" element={<UnderConstruction />} />
                
                {/* 租金市场页面 - 保持现有功能 */}
                <Route path="/rental/apartments-rent" element={<RentSummary />} />
                <Route path="/rental/apartments-rent/:locationType/:locationName" element={<RentDetail />} />
                
                {/* 其他页面 - 待开发 */}
                <Route path="/rental/apartments-vacancy" element={<UnderConstruction />} />
                <Route path="/rental/time-on-market" element={<UnderConstruction />} />
                <Route path="/sales-market/*" element={<UnderConstruction />} />
                <Route path="/affordability/*" element={<UnderConstruction />} />
                <Route path="/about" element={<UnderConstruction />} />
              </Routes>
            </Layout>
          </Router>
        </StyledThemeProvider>
      </MUIThemeProvider>
    </ChakraProvider>
  );
}

export default App;
