import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' },
      }}
    >
      <Toolbar /> {/* This pushes content below the app bar */}
      <List>
        <ListItem button component={Link} to="/">
          <ListItemIcon><DashboardIcon /></ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component={Link} to="/trucks">
          <ListItemIcon><LocalShippingIcon /></ListItemIcon>
          <ListItemText primary="Trucks" />
        </ListItem>
        <ListItem button component={Link} to="/shipments">
          <ListItemIcon><ListAltIcon /></ListItemIcon>
          <ListItemText primary="Shipments" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;