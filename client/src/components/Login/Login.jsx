import React, { useContext, useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import heroImg from '../../assets/logos/hero-img.png';
import { useAuth } from "../../contexts/AuthContext";
import Navbar from '../Navbar/Navbar';

import { useNavigate } from 'react-router-dom';

// graphql
import graphqlClient from '../../graphql/graphqlClient';
import { LOGIN_USER } from '../../graphql/mutations';

const theme = createTheme({
  palette: {
    primary: {
      main: '#C978FB',
    },
  },
});

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { authState, setAuthState } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('login - authState.isAuth:', authState.isAuth);
    if (authState.isAuth) {
      navigate('/dashboard');
    }
  }, [])


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // POST request to server
    try {
      const { user, token } = await graphqlClient(LOGIN_USER, { username, password });
      console.log('user', user)
      console.log('token', token)
      // success
      setAuthState({
        isAuth: true,
        username: data.username,
        userId: data.userId,
      })
      localStorage.setItem("username", user.username);
      localStorage.setItem("userId", user.userId);
      localStorage.setItem("token", token);
      return navigate('/dashboard');
    } catch (err) {
      // fail unable to login
      console.error(err);
    }

    // send request to server to login user
    // try {
    //   const response = await axios.post('/api/auth/login', {
    //     username,
    //     password,
    //   });
    //   // success
    //   const data = response.data;
    //   setAuthState({
    //     isAuth: true,
    //     username: data.username,
    //     userId: data.userId,
    //   });
    //   console.log('logged in - saving to local storage');
    //   localStorage.setItem("username", data.username);
    //   localStorage.setItem("userId", data.userId);
    //   localStorage.setItem("token", response.headers['authorization']);
    //   return navigate('/dashboard');
    // } catch (err) {
    //   if (err.response) {
    //     // fail - unable to log in
    //     // The request was made and the server responded with a status code
    //     // that falls out of the range of 2xx
    //     console.log('Failed to login. Error response data:', err.response.data);
    //     console.log('Failed to login. Error response status:', err.response.status);
    //   } else if (err.request) {
    //     // The request was made but no response was received
    //     console.log('Error request:', err.request);
    //   } else {
    //     // Something happened in setting up the request that triggered an Error
    //     console.log('Error message:', err.message);
    //   }
    // }
  }

  return (
    <>
    <Navbar/>
    <ThemeProvider theme={theme}>
      <div className="login-div" style={{ display: 'flex', height: '100vh' }}>
        <div className="hero-img" style={{ width: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img src={heroImg} alt="molecule image" style={{ maxWidth: '100%', maxHeight: '100%' }} />
        </div>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            width: '40%',
            padding: '0 20px',
          }}
        >
          
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            Login
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              value={username}
              autoFocus
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Login!
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        
      </div>
    </ThemeProvider>
    </>
  );
}

export default Login;