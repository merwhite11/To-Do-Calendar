import React, { useState, useEffect } from 'react';
import CheckIcon from '@mui/icons-material/Check';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import axios from 'axios';


export default function DisplaySharedWithUserItem({userEmail, viewSharedCal}) {
  const [checked, setChecked] = React.useState([0]);
  var sharedEmailsArray = ['boc@isalmostdone.com', 'nate@conglomerate.com',
  'excitedtobe@free.com'];
  const [shared, setShared] = React.useState(sharedEmailsArray);
  const [sharedCheck, setSharedCheck] = React.useState(sharedEmailsArray.toString());

  useEffect(async () => {
    await axios.get('/share/sharedWithUser', {
      params: {email: userEmail},
      withCredentials: true
    }).then((values) => {
      setShared(values.data);
      setSharedCheck((values.data).toString());
    }).catch((err) => {
      console.log(err);
    });
  }, [sharedCheck]);


  const handleViewShared = (ofThisEmail) => {
    viewSharedCal(ofThisEmail);
  }


  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [0];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
    handleViewShared(newChecked);
  };

  return (
    <div>
      <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {shared.map((email, index) => {
        const labelId = `shared-list-label-${email}`;
        return (
          <ListItem
            key={index}
            secondaryAction={
              <Checkbox
                edge="end"
                onChange={handleToggle(email)}
                checked={checked.indexOf(email) !== -1}
                inputProps={{ 'aria-labelledby': labelId }}
              />
            }
            disablePadding
          >
          <ListItemButton role={undefined} onClick={handleToggle(email)} dense>
            <ListItemText id={labelId} primary={`${email.user_email}`} />
          </ListItemButton>
          </ListItem>
        );
      })}
    </List>
    </div>
  );
}