import axios from 'axios';
import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import smallLogo from '../../assets/logos/smallLogo.png';
import { useAuth } from '../../contexts/AuthContext.js';
import { useTheme } from '../../contexts/ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';
import './authorizednavbar.scss';

// Authorized Navbar Defined
const AuthorizedNavbar = () => {
  const navigate = useNavigate();
  const { authState, setAuthState } = useAuth();
  // Handle Authorized State and to Handle Logout
  const handleLogOut = () => {
    setAuthState({
      isAuth: false,
      username: "",
      user_id: null,
    });
    localStorage.removeItem("username");
    localStorage.removeItem("user_id");
    localStorage.removeItem("token");
    return navigate('/');
  }

  const {darkMode, toggleDarkMode} = useTheme()
  // JSX to define our Authorized Navbar
  return (
    <nav className={`navbar ${darkMode ? 'dark' : ''}`}>
      <NavLink to="/">
        <div className="logo-container">
          <img src={smallLogo} alt="Small Logo" className="smallLogo" />
          <div className="logo">moleQLar</div>
        </div>
      </NavLink>
      <ul className="auth-nav-links">
        <li>
          <NavLink to="/dashboard" className="auth-nav-link">Dashboard</NavLink>
        </li>
        <li>
          <NavLink to="/" className="auth-nav-link" onClick={handleLogOut}>
            Logout
          </NavLink>
        </li>
        <li>
          <button className="theme-toggle" onClick={toggleDarkMode} aria-label="Toggle dark mode">
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default AuthorizedNavbar;