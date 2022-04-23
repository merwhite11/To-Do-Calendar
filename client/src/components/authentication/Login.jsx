import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Button, makeStyles, Link, Avatar, TextField, Paper, Typography, Container, Grid } from '@material-ui/core';
import GoogleIcon from '@mui/icons-material/Google';
import loginSchema from './LoginValidation.js';
import axios from 'axios'

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


const Login = ({setEmail, isLoggedIn, setIsLoggedIn}) => {
  const navigate = useNavigate();
  const classes = useStyles();
  const [state, setState] = useState({'email': '', 'password': ''})
  const [formErr, setFormErr] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const isMounted = useRef(false);

  const formData = {
    'password': state['password'],
    'email': state['email'],
  }

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn])

  const validation = async () => {
      loginSchema.validate(formData).catch((err) => {
      setFormErr(err.errors[0].split(' ')[0]);
      setErrMsg(err.errors[0])
    });
    let isValid = await loginSchema.isValid(formData);
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
    }));
  }

  const handleLogin = async () => {
    let isValid = await validation();
    if (isValid) {
      await axios.post('/auth/login', {
        'email': state['email'], 'password': state['password']}, {withCredentials: true}
      ).then((res) => {
        if(res.data === true) {
          setIsLoggedIn(true);
          setEmail(state['email']);
          navigate('/');
        } else {
          setFormErr('email');
          setErrMsg("Email doesn't exist or Incorrect password");
        }
      }).catch((err) => {
        alert('login err:', err);
      })
    } else {
      alert ('Invalid login submission');
    }
  }
  const handleGoogleLogin = async () => {
    window.open('/auth/google');
  }

  return (
    <Container component="main">
      <Grid container >
        <Paper elevation={10} className={classes.paper}>
          <Grid item align='center'>
            <Avatar
              variant="square"
              src={'/images/x-icon/todocal - logo.ico'}
              style={{width:'120px', height:'100px'}}/>
            <h1 style={{color:'#545863'}}><i>Sign In</i></h1>
          </Grid>
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
            onClick={() => (handleLogin())}
            >
              Sign in
          </Button>
          <Button
            startIcon={<GoogleIcon />}
            type='submit' color='primary'
            variant="contained"
            fullWidth
            onClick={() => (handleGoogleLogin())}
            >
              Sign in with google
            </Button>
          <Typography className={classes.bottomMsg}>
                Don't have an account? &nbsp;&nbsp;
              <Link  href='#' variant="body1" onClick={() => {navigate('/signup')}}>Sign up</Link>
          </Typography>
        </Paper>
      </Grid>
    </Container>
  );
}

export default Login;