import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ThemeProvider } from '../../contexts/ThemeContext.js';
import { useGraphContext } from '../../contexts/GraphContext.jsx';
import { createTheme } from '@mui/material';
import About from '../About/About.jsx';
import Team from '../Team/Team.jsx';
import Signup from './Signup.jsx';
import Login from '../Login/Login.jsx';
import Main from '../Main/Main.jsx';
import Dashboard from '../Dashboard/Dashboard.jsx';
import axios from 'axios';

//mock contexts and axios
jest.mock('../../contexts/AuthContext');
jest.mock('../../contexts/GraphContext.jsx');
jest.mock('axios');

//mock return values for auth context
const mockUseAuth = useAuth;
mockUseAuth.mockReturnValue({
  authState: { isAuth: false },
  setAuthState: jest.fn(),
});

//mock return values for graph context
const mockUseGraph = useGraphContext;
mockUseGraph.mockReturnValue({
  graphName: 'testGraph',
  setGraphName: jest.fn(),
  graphList: [],
  setGraphList: jest.fn,
});

// create custom MUI theme to pass to theme provider
const theme = createTheme({
  palette: {
    primary: {
      main: '#9c27b0',
    },
    custom: {
      darkMode: false,
    },
  },
});

describe('Signup page', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  test('Signup component is properly rendered to page', () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    //select components on signup page to test for correct rendering
    const homeLinkNav = screen.getByRole('link', { name: /Home/i });
    const homeLinkIcon = screen.getByAltText(/Small Logo/i);
    const teamLink = screen.getByRole('link', { name: /Team/i });
    const aboutLink = screen.getByRole('link', { name: /About/i });
    const githubLink = screen.getByAltText(/GitHub/i);
    const username = screen.getByLabelText(/Username/i);
    const email = screen.getByLabelText(/Email Address/i);
    const password = screen.getAllByText(/Password/i)[0];
    const confirmPw = screen.getByLabelText(/Confirm Password/i);
    const signupButton = screen.getByRole('button', { name: /Sign up/i });
    const mainImage = screen.getByAltText(/Main Graphic/i);
    const loginLink = screen.getByRole('link', {
      name: /Already have an account/i,
    });

    //verify selected fields are rendering properly
    expect(homeLinkNav).toBeInTheDocument();
    expect(homeLinkIcon).toBeInTheDocument();
    expect(teamLink).toBeInTheDocument();
    expect(aboutLink).toBeInTheDocument();
    expect(githubLink).toBeInTheDocument();
    expect(username).toBeInTheDocument();
    expect(email).toBeInTheDocument();
    expect(password).toBeInTheDocument();
    expect(confirmPw).toBeInTheDocument();
    expect(signupButton).toBeInTheDocument();
    expect(mainImage).toBeInTheDocument();
    expect(loginLink).toBeInTheDocument();
  });

  // test suite for Signup Page
  describe('Navigation tests for Signup page', () => {
    //reset memory router before each navigation test
    beforeEach(() => {
      render(
        <MemoryRouter initialEntries={['/signup']}>
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Main />} />
            <Route path="/about" element={<About />} />
            <Route path="/team" element={<Team />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </MemoryRouter>
      );
    });
    // Test Navigation to Home/Main upon Icon click
    test('Successfully navigates to Home/Main route using icon link', () => {
      const homeLinkIcon = screen.getByAltText(/Small Logo/i);
      fireEvent.click(homeLinkIcon);
      expect(
        screen.getByText(/Implementation in seconds/i)
      ).toBeInTheDocument();
    });
    // Test Navigation to Home/Main upon NavBar click
    test('Successfully navigates to Home/Main route using navbar link', () => {
      const homeLinkNav = screen.getByRole('link', { name: /Home/i });
      fireEvent.click(homeLinkNav);
      expect(
        screen.getByText(/Implementation in seconds/i)
      ).toBeInTheDocument();
    });
    // Test Navigation to Team page upon click
    test('Successfully navigates to Team route on click', () => {
      const teamLink = screen.getByRole('link', { name: /Team/i });
      fireEvent.click(teamLink);
      expect(screen.getByText(/Meet the Team/i)).toBeInTheDocument();
    });
    // Test Navigation to About page upon click
    test('Successfully navigates to About route on click', () => {
      const aboutLink = screen.getByRole('link', { name: /About/i });
      fireEvent.click(aboutLink);
      expect(screen.getByText(/think about GraphQL/i)).toBeInTheDocument();
    });
    // Test Navigation to Login page upon click
    test('Successfully navigates to Login route on click', () => {
      const loginLink = screen.getByRole('link', {
        name: /Already have an account/i,
      });
      fireEvent.click(loginLink);
      expect(
        screen.getByRole('link', { name: /have an account/i })
      ).toBeInTheDocument();
    });
  });
  // Test for Successful Signup Submission
  describe('Handles form submission and successfully signs up', () => {
    test('Successfully navigates to Dashboard route on signup', async () => {
      //mock resolved value from axios call
      axios.post.mockResolvedValue({
        data: {
          username: 'test1',
          userId: '111111',
        },
        headers: {
          authorization: 'Bearer token',
        },
      });
      //render component using themeProvider to handle dashboard theme
      render(
        <ThemeProvider theme={theme}>
          <MemoryRouter initialEntries={['/signup']}>
            <Routes>
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </MemoryRouter>
        </ThemeProvider>
      );

      //select signup button and simulate form entry
      const signupButton = screen.getByRole('button', { name: /Sign up/i });

      fireEvent.change(screen.getByLabelText(/Username/i), {
        target: { value: 'test1' },
      });

      fireEvent.change(screen.getByLabelText(/Email Address/i), {
        target: { value: 'test1@gmail.com' },
      });

      const passwordFields = screen.getAllByLabelText(/Password/i);
      passwordFields.forEach((field) => {
        fireEvent.change(field, {
          target: { value: '111111' },
        });
      });

      //submit form and check for dashboard rendering
      await act(async () => {
        fireEvent.click(signupButton);
      });

      expect(
        screen.getByRole('link', { name: /Dashboard/i })
      ).toBeInTheDocument();
    });
  });
});
