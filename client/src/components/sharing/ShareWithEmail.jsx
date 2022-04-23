import React, { useState, useEffect } from 'react';
import { styled, alpha } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import TextField from '@mui/material/TextField';
import emailSchema from './EmailValidation.jsx';
import ShareList from './ShareList.jsx';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import AddBoxIcon from '@mui/icons-material/AddBox';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function ShareWithEmail(props) {
  const [formErr, setFormErr] = useState('');
  const [email, setEmail] = useState({'email': ''});
  const [errMsg, setErrMsg] = useState('');

  const handleChange = (e) => {
    setFormErr('');
    const { name, value } = e.target;
      setEmail((prevState) => ({
        ...prevState,
        [name]: value,
      }))
  };

  const emailFormValidation = async (emailVal) => {
    emailSchema.validate(emailVal).catch((err) => {
      setFormErr(err.errors[0].split(' ')[0]);
      setErrMsg(err.errors[0])
    });
    let isValid = await emailSchema.isValid(emailVal);
    return isValid;
  };

  const updateEmail = (e) => {
    e.preventDefault();
    emailFormValidation(email).then((res) => {
      props.emailAdd(email.email);
    });
  }

  return (
    <>
      <TextField
        name='email'
        error={formErr === 'email' ? true : false}
        placeholder='Enter email address'
        label="Email"
        variant="outlined"
        value={email["email"]}
        require = 'true'
        helperText={formErr === 'email' ? errMsg : ''}
        onChange={(e)=>(handleChange(e))}
      />
      <IconButton
        aria-label="add"
        onClick={(e) => (updateEmail(e))}
      >
        <AddBoxIcon />
      </IconButton>
    </>
  );
}