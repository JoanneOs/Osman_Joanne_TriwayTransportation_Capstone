import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';
import { fetchTrucks } from '../services/api';

const columns = [
  { field: 'licensePlate', headerName: 'License Plate', width: 150 },
  { field: 'make', headerName: 'Make', width: 120 },
  { field: 'model', headerName: 'Model', width: 150 },
  { field: 'year', headerName: 'Year', width: 100 },
  { 
    field: 'capacity', 
    headerName: 'Capacity', 
    width: 120,
    valueFormatter: (params) => `${params.value} kg`
  },
  { 
    field: 'status', 
    headerName: 'Status', 
    width: 150,
    renderCell: (params) => (
      <span style={{
        color: params.value === 'available' ? 'green' : 'orange',
        fontWeight: 'bold'
      }}>
        {params.value}
      </span>
    )
  },
  { field: 'currentLocation', headerName: 'Location', width: 200 }
];

export default function Trucks() {
  const [trucks, setTrucks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getTrucks = async () => {
      try {
        const response = await fetchTrucks();
        setTrucks(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    getTrucks();
  }, []);

  if (loading) return <div>Loading trucks...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Truck Fleet</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          to="/trucks/new"
        >
          Add Truck
        </Button>
      </Box>
      
      <DataGrid
        rows={trucks}
        columns={columns}
        getRowId={(row) => row._id}
        pageSize={10}
        rowsPerPageOptions={[10]}
        checkboxSelection
        disableSelectionOnClick
      />
    </Box>
  );
}