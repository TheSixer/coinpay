import { useEffect, useRef, useState } from "react";
import { Outlet, useNavigate } from 'react-router-dom';
import SideMenu from "../components/SideMenu";
import LogoImg from '../assets/images/logo.png';
import { Avatar, Badge, Button, Grid, IconButton, Menu, MenuItem, Stack, Tab, Tabs } from "@mui/material";
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import { deepPurple } from '@mui/material/colors';
import { queryNotice } from "../services/order";
import { useInterval } from "ahooks";

const NoticeAudio = require('../assets/audio/notice.mp3');

const TraderPage = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notice, setNotice] = useState(0);
  const [value, setValue] = useState(0);
  const open = Boolean(anchorEl);
  const hasNote = Boolean(notice);

  const noticeRef = useRef<any>(null)

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

  const handleNotice = async () => {
    try {
      const { data } = await queryNotice();
      setNotice(data || 0);
      if (data) {
        noticeRef.current?.play();
      }
    } catch (error) {}
  }
  
  const clear = useInterval(() => {
    handleNotice();
  }, 20 * 1000);

  useEffect(() => {

    return () => {
      clear();
    }
  }, []);

  return (
    <div className="container mx-auto">
      <div className="flex justify-between">
        <a href="/">
          <img src={LogoImg} className="w-32" alt="" />
        </a>

        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton color="primary" aria-label="add to shopping cart" onClick={() => setNotice(0)}>
            <Badge color="secondary" variant="dot" invisible={!hasNote}>
              <NotificationsIcon />
            </Badge>
          </IconButton>
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
            Trader
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
          <MenuItem onClick={() => navigate('/trader/balance')}>My account</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </div>
      <div className="block sm:hidden">
        <Tabs value={value} onChange={handleChange} sx={{mb: 2}}>
          <Tab label="我的账户" id="balance" />
          <Tab label="审核列表" id="list" />
          <Tab label="交易记录" id="transfer-records" />
        </Tabs>
      </div>
      
      <Grid container spacing={2}>
        <Grid item xs={2} sm={4} md={2} className="hidden sm:block">
          <SideMenu />
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

      <audio
        className="hidden"
        ref={noticeRef}
        src={NoticeAudio}
        autoPlay={false}
      />
    </div>
  )
}

export default TraderPage
