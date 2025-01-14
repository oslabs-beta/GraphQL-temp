import React, { createContext, useState, useEffect, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // const navigate = useNavigate();
  const [authState, setAuthState] = useState({
    isAuth: false,
    username: '',
    userId: null,
    loading: true, // Add loading state
  });

  useEffect(() => {
    async function verifyUser() {
      // check local storage
      const token = localStorage.getItem('token');

      if (!token) {
        setAuthState((prev_state) => ({ ...prev_state, loading: false }));
        return;
      }

      if (!authState.loading && !authState.isAuth) {
        // navigate to login page -- handled in PrivateRoute Component
      }

      // verify user token
      let config = {
        headers: { authorization: `${token}` },
      };
      try {
        const response = await axios.post('/api/auth/protected', {}, config);
        if (response.status !== 200) {
          console.log('response.message:', response.message);
          console.log(
            'Unable to verify user. Reponse status: ',
            response.status
          );
          setAuthState({
            isAuth: false,
            username: '',
            userId: null,
            loading: false, // Set loading to false when done
          });
          // TODO - create refresh token
        } else {
          // successful login
          const data = response.data;
          localStorage.setItem('username', data.username);
          localStorage.setItem('userId', data.userId);
          localStorage.setItem('token', response.headers['authorization']);
          setAuthState({
            isAuth: true,
            username: data.username,
            userId: data.userId,
            loading: false, // Set loading to false when done
          });
        }
      } catch (err) {
        if (err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          if (err.response.status === 401) {
            console.log('Error verifying user token');
            setAuthState({
              isAuth: false,
              username: '',
              userId: null,
              loading: false,
            });
            localStorage.removeItem('username');
            localStorage.removeItem('userId');
            localStorage.removeItem('token');
          }
          console.log('Error response data:', err.response.data);
          console.log('Error response status:', err.response.status);
        } else if (error.request) {
          // The request was made but no response was received
          console.log('Error request:', err.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error message:', err.message);
        }
        // return navigate('/login');
      }
    }
    verifyUser();
  }, [authState.loading]);

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
