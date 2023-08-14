import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { useNavigate, useLocation } from 'react-router-dom';

export default function BasicList() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <Box sx={{ width: '100%', maxWidth: 320 }}>
      <nav aria-label="main mailbox folders">
        <List>
          <ListItem selected={pathname === '/admin/rate'} disablePadding>
            <ListItemButton onClick={() => navigate('/admin/rate')}>
              <ListItemIcon>
                <InboxIcon color='secondary' />
              </ListItemIcon>
              <ListItemText primary="汇率管理" />
            </ListItemButton>
          </ListItem>
          <ListItem selected={pathname === '/admin/recharge'} disablePadding>
            <ListItemButton onClick={() => navigate('/admin/recharge')}>
              <ListItemIcon>
                <DraftsIcon color='secondary' />
              </ListItemIcon>
              <ListItemText primary="入金审核" />
            </ListItemButton>
          </ListItem>
          <ListItem selected={pathname === '/admin/withdraw'} disablePadding>
            <ListItemButton onClick={() => navigate('/admin/withdraw')}>
              <ListItemIcon>
                <ReceiptLongIcon color='secondary' />
              </ListItemIcon>
              <ListItemText primary="出金审核" />
            </ListItemButton>
          </ListItem>
          <ListItem selected={pathname === '/admin/orders'} disablePadding>
            <ListItemButton onClick={() => navigate('/admin/orders')}>
              <ListItemIcon>
                <ReceiptLongIcon color='secondary' />
              </ListItemIcon>
              <ListItemText primary="全部订单" />
            </ListItemButton>
          </ListItem>
          <ListItem selected={pathname === '/admin/trader'} disablePadding>
            <ListItemButton onClick={() => navigate('/admin/trader')}>
              <ListItemIcon>
                <ReceiptLongIcon color='secondary' />
              </ListItemIcon>
              <ListItemText primary="交易员管理" />
            </ListItemButton>
          </ListItem>
        </List>
      </nav>
      <Divider sx={{ bgcolor: 'grey' }} />
      {/* <nav aria-label="secondary mailbox folders">
        <List>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="Trash" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component="a" href="#simple-list">
              <ListItemText primary="Spam" />
            </ListItemButton>
          </ListItem>
        </List>
      </nav> */}
    </Box>
  );
}