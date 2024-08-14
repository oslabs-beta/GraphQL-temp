import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import githubLogo from '../../assets/logos/githubLogo.png';
import linkedInLogo from '../../assets/logos/linkedin.png';
import smallLogo from '../../assets/logos/smallLogo.png';
import './navbar.scss';

// Navbar before login component
const Navbar = () => {
  return (
    <nav className='navbar'>
      <Link to='/'>
        <div className='logo-container'>
          <img src={smallLogo} alt='Small Logo' className='smallLogo' />
          <div className='logo'>moleQLar</div>
        </div>
      </Link>
      <ul className='nav-links'>
        <li>
          <NavLink className='nav-link' to='/'>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink className='nav-link' to='/team'>
            Team
          </NavLink>
        </li>
        <li>
          <NavLink className='nav-link' to='/about'>
            About
          </NavLink>
        </li>
      </ul>
      <div className='social-icons'>
        <a href='https://github.com/oslabs-beta/moleQLar' target='_blank'>
          <img src={githubLogo} alt='GitHub' className='githubLogo' />
        </a>
        <a href='https://www.linkedin.com/company/moleqlar/' target='_blank'>
          <img src={linkedInLogo} alt='LinkedIn' className='linkedIn' />
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
