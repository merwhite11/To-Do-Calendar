import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline } from '@material-ui/core';
import axios from 'axios'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import CircularProgress from '@mui/material/CircularProgress';
import ShareWithOthers from './sharing/ShareDropDown.jsx';
import ViewShares from './sharing/SharedWithUserDropdown.jsx';

var pages = [];
const settings = ['Logout'];

const TopBar = ({setMyEvents, setAllTodos, userEmail, isLoading, setIsLoggedIn, isLoggedIn, isMobile, onCalendar, setOnCalendar, viewSharedCal}) => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const navigate = useNavigate();
  const ShareMenu = (<ShareWithOthers userEmail={userEmail}/>);
  const ViewShared = (<ViewShares userEmail={userEmail} viewSharedCal={viewSharedCal}/>);

  if (!isMobile) {
    pages = []
  } else if (isMobile && onCalendar) {
    pages = ['To Do List']
  } else {
    pages = ['Calendar']
  }
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handlePage = (event) => {
    setOnCalendar(!onCalendar);
  };

  const handleCloseUserMenu = (e) => {
    setAnchorElUser(null);
    if (e.target.innerHTML === 'Logout') {
      axios.get('http://localhost:3000/auth/logout', {withCredentials: true})
      .then((res) => {
        if (res.data === false) {
          setIsLoggedIn(false)
          setMyEvents([]);
          setAllTodos([]);
        }
      })
      .catch((err) => {
        console.log(err);
      })
    }
  };

  return (
    <div>
      <CssBaseline />
      <AppBar style={{ background: 'white', marginBottom:'20px'}} position='static'>
        <Toolbar >
          <Box style={{display: "flex"}}>
            {isLoggedIn && ShareMenu}
          </Box>
          <Box sx={{marginLeft: '10px', display: "flex"}}>
           {isLoggedIn && ViewShared}
          </Box>
          <Box sx={{marginLeft: '15px'}}>
            {isLoggedIn && isMobile && <IconButton
              name={pages[0]}
              onClick={(e) => {handlePage(e)}}
              >
                {pages[0] === 'Calendar' ?
                <CalendarMonthIcon style={{fontSize: '50px'}}/> :
                <AssignmentTurnedInIcon style={{fontSize: '50px'}}/>}
              </IconButton>}
          </Box>
          <Box style={{margin: '0 auto', display: "flex"}}>
            {(isMobile && isLoggedIn) ?
            null
            :
             <Avatar variant="square" src={'/images/x-icon/todocal - logo.ico'}
                style={{marginLeft:'25px', width:'50px', height:'50px'}}/>}
          </Box>
         <Box sx={{ flexGrow: 0 }}>
            {isLoading ? <CircularProgress /> : (isLoggedIn ?
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt={userEmail} src="/" />
              </IconButton>
            </Tooltip>
            :
            <Box>
              <Button
              onClick={() => {navigate('/signin')}}
              style={{ background: '#1d71e4',
              color:'white',
              borderRadius:'5px'
              }}>
                Sign in
              </Button >
            </Box>
            )}
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={(e) => {handleCloseUserMenu(e)}}>
                  <Typography textAlign="center" >{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default TopBar;
