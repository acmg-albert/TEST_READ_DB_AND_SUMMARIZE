import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import Layout from './components/layout/Layout';
import theme from './theme';
import styledTheme from './theme/styled';
import './styles/global.css';  // 导入全局样式

// 导入现有的租金数据页面
import { SummaryPage as RentSummary } from './pages/RentalMarket/RentSummary';
import { LocationDetailPage as RentDetail } from './pages/RentalMarket/RentDetail';
// 导入空置率页面
import { VacancySummary, VacancyDetails } from './pages/RentalMarket/apartmentlist/vacancy';

// 创建 MUI 主题
const muiTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0AB3B0',
      light: '#81D8D0',
      dark: '#006D6B',
      contrastText: '#fff',
    },
    secondary: {
      main: '#81D8D0',
      light: '#E0F5F4',
      dark: '#0AB3B0',
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
      main: '#0AB3B0',
      light: '#81D8D0',
      dark: '#006D6B',
      contrastText: '#fff',
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
      contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    text: {
      primary: '#666565',
      secondary: '#757575',
    },
    background: {
      paper: '#fff',
      default: '#fafafa',
    },
  },
  typography: {
    fontFamily: [
      'Heebo',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontFamily: 'Inter, sans-serif',
      fontWeight: 800,
    },
    h2: {
      fontFamily: 'Inter, sans-serif',
      fontWeight: 700,
    },
    h3: {
      fontFamily: 'Inter, sans-serif',
      fontWeight: 700,
    },
    h4: {
      fontFamily: 'Inter, sans-serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: 'Inter, sans-serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: 'Inter, sans-serif',
      fontWeight: 600,
    },
    body1: {
      color: '#666565',
    },
    body2: {
      color: '#666565',
    },
  },
  components: {
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: '#0AB3B0',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: 'Heebo, sans-serif',
          fontWeight: 500,
          transition: '.5s',
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
                
                {/* 空置率页面 */}
                <Route path="/rental/apartments-vacancy" element={<VacancySummary />} />
                <Route path="/rental/apartments-vacancy/details/:type/:name" element={<VacancyDetails />} />
                
                {/* 其他页面 - 待开发 */}
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
