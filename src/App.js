import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Trucks from './pages/Trucks';
import Shipments from './pages/Shipments';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/trucks" element={<Trucks />} />
            <Route path="/shipments" element={<Shipments />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;