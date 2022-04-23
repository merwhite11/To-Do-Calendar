import React, { useState, useEffect, Suspense } from 'react';
import { styled, alpha } from '@mui/material/styles';
import axios from 'axios';
import Button from '@mui/material/Button';
import Menu from'@mui/material/Menu';
const Divider = React.lazy(() => import('@mui/material/Divider'));
const ShareList = React.lazy(() => import('./ShareList.jsx'));
const ShareWithEmail = React.lazy(() => import('./ShareWithEmail.jsx'));

const ShareMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, ' +
      'rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));


function DisplaySharedWithUserDropdown({userEmail}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [formErr, setFormErr] = useState('');
  const open = Boolean(anchorEl);
  const sharedEmailsArray = ['boc@isalmostdone.com', 'nate@conglomerate.com', 'excitedtobe@free.com'];
  const [shares, setShares] = useState(sharedEmailsArray);
  const [sharesCheck, setSharesCheck] = useState(sharedEmailsArray.toString());
  const [currentUser, setCurrentUser] = useState('');

  if (currentUser !== userEmail) {
    setCurrentUser(userEmail);
  }

  useEffect(async () => {
    if (userEmail) {
      await axios.get('http://localhost:3000/share/sharedByUser', {
        params: {email: userEmail},
        withCredentials: true
      }).then((values) => {
        setShares(values.data);
        setSharesCheck((values.data).toString());
      }).catch((err) => {
        setSharesCheck(sharedEmailsArray.toString());
        setCurrentUser(null);
      });
    }
    else {
      setSharesCheck(sharedEmailsArray.toString());
      setCurrentUser(null);
    }
  }, [sharesCheck, currentUser]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEmailRemove = (e) => async () => {
    const currentIndex = shares.indexOf(e);
    await axios.delete('http://localhost:3000/share/deleteFromShares', {
      params: {email: [userEmail, e.shared_to]},
      withCredentials: true
    }).then((result) => {
      const newShares = [...shares];
      newShares.splice(currentIndex, 1);
      setShares(newShares);
    }).catch((err) => {
      throw err;
    });
  };

  const handleEmailAdd = async (emailToAdd) => {
    if (emailToAdd === currentUser) {
      alert('can not add yourself');
    }
    else {
      await axios.post('http://localhost:3000/share/insertToShares', {
        email: [userEmail, emailToAdd],
        withCredentials: true
      }).then((result) => {
        const newShares = [...shares];
        newShares.push({shared_to: emailToAdd});
        setShares(newShares);
      }).catch((err) => {
        alert('Invalid email');
      });
    }
  };

  return (
    <div>
      <Button
        id="shared-with-user-button"
        aria-controls={open ? 'shared-with-user-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
      >
        Share
      </Button>

      <ShareMenu
        id="shared-with-user-menu"
        MenuListProps={{
          'aria-labelledby': 'shared-with-user-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <ShareWithEmail emailArray={shares} emailAdd={handleEmailAdd}/>
        </Suspense>
        <Suspense fallback={<div>Loading...</div>}>
          <Divider sx={{ my: 0.8 }} />
        </Suspense>
        <Suspense fallback={<div>Loading...</div>}>
          <ShareList emailArray={shares} emailRemove={handleEmailRemove}/>
        </Suspense>
      </ShareMenu>
    </div>
  );
}

export default DisplaySharedWithUserDropdown;