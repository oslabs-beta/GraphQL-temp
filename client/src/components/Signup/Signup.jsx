import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import heroImg from '../../assets/logos/hero-img.png';
import Navbar from '../Navbar/Navbar';
import { useAuth } from '../../contexts/AuthContext';
import './signup.scss';

// Defining Default Theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#9c27b0',
    },
  },
});

// Signup Functionality
function Signup() {
  let navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { authState, setAuthState } = useAuth();

  // useEffect to Navgiate to Dashboard
  useEffect(() => {
    if (authState.isAuth) {
      navigate('/dashboard');
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  // Form Validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    // else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handling Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      setSubmitError('');
      try {
        // await signup(formData);  // send POST request to server to create new user

        try {
          const response = await axios.post('/api/auth/signup', formData);
          const data = response.data;
          setAuthState({
            isAuth: true,
            username: data.username,
            userId: data.userId,
          });
          // console.log('signup succesful - updating local storage');
          localStorage.setItem('username', data.username);
          localStorage.setItem('userId', data.userId);
          localStorage.setItem('token', response.headers['authorization']);
          // navigate outside of try-catch block
        } catch (err) {
          if (err.response) {
            // response status code outside 2XX
            console.log(
              'Failed to sign up. Error response data:',
              err.response.data
            );
            console.log(
              'Failed to sign up. Error response status:',
              err.response.status
            );
          } else if (err.request) {
            // request was made, but no response received
            console.log('Error request:', err.request);
          } else {
            // error in setting up request
            console.log('Error message:', err.message);
          }
        }
        setSubmitSuccess(true);
      } catch (error) {
        console.error(error);
        setSubmitError(
          error.response?.data?.message || 'An error occurred during signup'
        );
      } finally {
        setIsLoading(false);
      }
      return navigate('/dashboard');
    }
  };

  // JSX to define Signup Component
  return (
    <>
      <Navbar />

      <ThemeProvider theme={theme}>
        <div className='login-div'>
          <div className='signup-hero-img'>
            <img src={heroImg} alt='Main Graphic' />
          </div>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              maxWidth: '400px',
              margin: 'auto',
              padding: '20px',
            }}
          >
            <Typography component='h1' variant='h5'>
              Sign up
            </Typography>

            {submitSuccess && (
              <Alert severity='success' sx={{ width: '100%', mt: 2 }}>
                Signup successful! You can now login.
              </Alert>
            )}

            {submitError && (
              <Alert severity='error' sx={{ width: '100%', mt: 2 }}>
                {submitError}
              </Alert>
            )}

            <Box
              component='form'
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 3, width: '100%' }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id='username'
                    label='Username'
                    name='username'
                    autoComplete='username'
                    value={formData.username}
                    onChange={handleChange}
                    error={!!errors.username}
                    helperText={errors.username}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id='email'
                    label='Email Address'
                    name='email'
                    autoComplete='email'
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name='password'
                    label='Password'
                    type='password'
                    id='password'
                    autoComplete='new-password'
                    value={formData.password}
                    onChange={handleChange}
                    error={!!errors.password}
                    helperText={errors.password}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name='confirmPassword'
                    label='Confirm Password'
                    type='password'
                    id='confirmPassword'
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                  />
                </Grid>
              </Grid>
              <Button
                type='submit'
                fullWidth
                variant='contained'
                sx={{ mt: 3, mb: 2 }}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : 'Sign Up'}
              </Button>
              <Grid container justifyContent='flex-end'>
                <Grid item>
                  <Link href='/login' variant='body2'>
                    Already have an account? Sign in
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

export default Signup;
