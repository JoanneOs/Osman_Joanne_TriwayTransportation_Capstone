import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, CircularProgress } from '@mui/material';
import { fetchTrucks, fetchShipments } from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    truckCount: 0,
    availableTrucks: 0,
    shipmentCount: 0,
    activeShipments: 0,
    loading: true,
    error: null
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [trucksRes, shipmentsRes] = await Promise.all([
          fetchTrucks(),
          fetchShipments()
        ]);

        const availableTrucks = trucksRes.data.filter(t => t.status === 'available').length;
        const activeShipments = shipmentsRes.data.filter(s => 
          ['loading', 'in-transit'].includes(s.status)
        ).length;

        setStats({
          truckCount: trucksRes.data.length,
          availableTrucks,
          shipmentCount: shipmentsRes.data.length,
          activeShipments,
          loading: false,
          error: null
        });
      } catch (err) {
        setStats(prev => ({
          ...prev,
          loading: false,
          error: err.message
        }));
      }
    };

    loadData();
  }, []);

  if (stats.loading) return <CircularProgress />;
  if (stats.error) return <Typography color="error">{stats.error}</Typography>;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard Overview
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Total Trucks</Typography>
            <Typography variant="h3">{stats.truckCount}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Available Trucks</Typography>
            <Typography variant="h3">{stats.availableTrucks}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Total Shipments</Typography>
            <Typography variant="h3">{stats.shipmentCount}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Active Shipments</Typography>
            <Typography variant="h3">{stats.activeShipments}</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}