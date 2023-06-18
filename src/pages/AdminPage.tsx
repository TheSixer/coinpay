import React, { useState } from "react";
import { Outlet, useNavigate } from 'react-router-dom';
import AdminMenu from "../components/AdminMenu";
import LogoImg from '../assets/images/logo.png';
import { Avatar, Button, Grid, Menu, MenuItem, Stack, Tab, Tabs } from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import { deepPurple } from '@mui/material/colors';

const TraderPage = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [value, setValue] = useState(0);
  const open = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  const handleChange = (e: any, newValue: number) => {
    setValue(newValue);
    navigate(`/trader/${e.target.id}`)
  }

  return (
    <div className="container mx-auto">
      <div className="flex justify-between">
        <a href="/">
          <img src={LogoImg} className="w-32" alt="" />
        </a>

        <Stack direction="row" spacing={1} alignItems="center">
          <Avatar sx={{ bgcolor: deepPurple[500] }}>
            <PersonIcon />
          </Avatar>
          <Button
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
          >
            Admin
          </Button>
        </Stack>

        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </div>
      <div className="block sm:hidden">
        <Tabs value={value} onChange={handleChange} sx={{mb: 2}}>
          <Tab label="汇率管理" id="rate" />
          <Tab label="入金审核" id="recharge" />
          <Tab label="出金审核" id="withdraw" />
          <Tab label="交易员管理" id="trader" />
        </Tabs>
      </div>
      
      <Grid container spacing={2}>
        <Grid item xs={2} sm={4} md={2} className="hidden sm:block">
          <AdminMenu />
        </Grid>
        <Grid item xs={12} sm={8} md={10}>
          <Outlet />
        </Grid>
      </Grid>
      {/* <div className="flex">
        <div className="shrink-0 w-64 py-4">
          <SideMenu />
        </div>
        <div className="flex-1 p-6 w-full">
          <div className="container">
            <Outlet />
          </div>
        </div>
      </div> */}
    </div>
  )
}

export default TraderPage
