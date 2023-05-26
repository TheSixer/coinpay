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
import { useNavigate } from 'react-router-dom';

export default function BasicList() {
  const navigate = useNavigate();

  return (
    <Box sx={{ width: '100%', maxWidth: 320 }}>
      <nav aria-label="main mailbox folders">
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate('/trader/balance')}>
              <ListItemIcon>
                <InboxIcon color='secondary' />
              </ListItemIcon>
              <ListItemText primary="我的账户" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate('/trader/list')}>
              <ListItemIcon>
                <DraftsIcon color='secondary' />
              </ListItemIcon>
              <ListItemText primary="审核列表" />
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