import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { makeStyles, IconButton, Link, Avatar, TextField, Box, Paper, Typography, AppBar, Button, Card, Container, CardActions, CardContent, CardMedia, CssBaseline, Grid, Toolbar } from '@material-ui/core';
import GoogleIcon from '@mui/icons-material/Google';
import registrationSchema from './RegistrationValidation.jsx';
import axios from 'axios'
import img from '../../../dist/images/d1.png';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: '20px',
    margin: '150px auto',
    borderRadius: '20px',
    width: '400px'
  },
  fieldGap: {
    margin: '10px 0',
  },
  btnStyle: {
    margin: '15px 0',
    backgroundColor:'#F9C846',
    color: '#545863',
    '&:hover': {
      backgroundColor: '#545863',
      color: '#FFE3E3',
    },
  },
  bottomMsg: {
    marginTop: '20px'
  }
}));

const Login = () => {
  const navigate = useNavigate();
  const classes = useStyles();
  const [state, setState] = useState({
    'firstName': '',
    'lastName' : '',
    'email': '',
    'password': ''
  });
  const [formErr, setFormErr] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const isMounted = useRef(false);

  const formData = {
    'firstName': state['firstName'],
    'lastName': state['lastName'],
    'password': state['password'],
    'email': state['email'],
  }

  const validation = async () => {
    registrationSchema.validate(formData).catch((err) => {
      setFormErr(err.errors[0].split(' ')[0]);
      setErrMsg(err.errors[0])
    });
    let isValid = await registrationSchema.isValid(formData);
    return isValid;
  }
  useEffect(() => {
    if (isMounted.current) {
      validation();
    } else {
      isMounted.current = true;
    }
  }, [state])

  const handleChange =  (e) => {
    setFormErr('');
    const { name, value } = e.target;
        setState((prevState) => ({
            ...prevState,
            [name]: value,
        }))
  }


  const handleRegister = async () => {
    let isValid = await validation();
    if (isValid) {
      await axios.post('/auth/register', {
        'firstName': state['firstName'], 'lastName': state['lastName'],
        'email': state['email'], 'password': state['password']
      }, {withCredentials: true}).then((res) => {
        if(res.data) {
          navigate('/signin')
        } else {
          setFormErr('email');
          setErrMsg('email already existed')
        }
      }).catch((err) => {
        alert('Error:', err);
      })
    } else {
      alert('Invalid registration submission');
    }
  }

  return (
    <Container component="main">
      <Grid container >
        <Paper elevation={10} className={classes.paper}>
          <Grid item align='center'>
            <Avatar
              variant="square"
              alt="Remy Sharp"
              src={img}
              style={{width:'120px', height:'100px'}}/>
            <h1 style={{color:'#545863'}}><i>Sign Up</i></h1>
          </Grid>
          <TextField
            name='firstName'
            error={formErr === 'firstName' ? true : false}
            placeholder='Enter your first name'
            label='First Name'
            variant="outlined"
            value={state['firstName']}
            require = 'true'
            helperText={formErr === 'firstName' ? errMsg : ''}
            fullWidth
            className={classes.fieldGap}
            onChange={(e)=>(handleChange(e))}
          />
          <TextField
            name='lastName'
            error={formErr === 'lastName' ? true : false}
            placeholder='Enter your last name'
            label='Last Name'
            variant="outlined"
            value={state['lastName']}
            require = 'true'
            helperText={formErr === 'lastName' ? errMsg : ''}
            fullWidth
            className={classes.fieldGap}
            onChange={(e)=>(handleChange(e))}
          />
          <TextField
            name='email'
            error={formErr === 'email' ? true : false}
            placeholder='Enter email address'
            label="Email"
            variant="outlined"
            value={state["email"]}
            require = 'true'
            helperText={formErr === 'email' ? errMsg : ''}
            fullWidth
            className={classes.fieldGap}
            onChange={(e)=>(handleChange(e))}
          />
          <TextField
            name='password'
            value={state['password']}
            autoComplete='off'
            error={formErr === 'password' ? true : false}
            placeholder='Enter Password'
            label="Password"
            variant="outlined"
            type='password'
            helperText={formErr === 'password' ? errMsg : ''}
            require = 'true'
            fullWidth
            className={classes.fieldGap}
            onChange={(e)=>(handleChange(e))}
          />
          <Button
            className={classes.btnStyle}
            type='submit' color='primary'
            variant="contained"
            fullWidth
            onClick={() => (handleRegister())}
            >
              Sign Up
          </Button>
          <Typography className={classes.bottomMsg}>
                Already have an account? &nbsp;&nbsp;
                <Link  href='#' variant="body1" onClick={() => {navigate('/signin')}}>Sign in</Link>
          </Typography>
        </Paper>
      </Grid>
    </Container>
  );
}

export default Login;