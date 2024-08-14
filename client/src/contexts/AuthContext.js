import React, { createContext, useState, useEffect, useContext } from "react";
// import { useNavigate } from 'react-router-dom';
// graphQL
import graphqlClient from "../graphql/graphqlClient";
import { VALIDATE_SESSION } from "../graphql/mutations";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // const navigate = useNavigate();
  const [authState, setAuthState] = useState({
    isAuth: false,
    username: "",
    userId: null,
    loading: true, // Add loading state
  });

  useEffect(() => {
    async function verifyUser() {
      // check local storage
      const token = localStorage.getItem("token");

      if (!token) {
        setAuthState((prev_state) => ({ ...prev_state, loading: false }));
        return;
      }

      if (!authState.loading && !authState.isAuth) {
        // navigate to login page -- handled in PrivateRoute Component
      }

      // verify user token
      try {
        const response = await graphqlClient(VALIDATE_SESSION, {
          token: `${token}`,
        });
        if (response.status !== 200) {
          // fail
          setAuthState({
            isAuth: false,
            username: "",
            userId: null,
            loading: false,
          });
          // TODO - create refresh token
        } else {
          // success
          const data = response.data.data.validateSession;
          const { user, token } = data;
          // console.log("data:", data);
          // console.log("user:", user);
          // console.log("token:", token);
          setAuthState({
            isAuth: true,
            username: user.username,
            userId: user.userId,
            loading: false,
          });
          localStorage.setItem("username", user.username);
          localStorage.setItem("userId", user.userId);
          localStorage.setItem("token", token);
        }
      } catch (err) {
        console.error("Error validating session:", err);
        if (err.response.status === 401) {
          console.log("Error verifying user token");
          setAuthState({
            isAuth: false,
            username: "",
            userId: null,
            loading: false,
          });
          localStorage.removeItem("username");
          localStorage.removeItem("userId");
          localStorage.removeItem("token");
        }
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
