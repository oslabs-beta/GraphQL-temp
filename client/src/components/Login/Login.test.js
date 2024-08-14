// Import necessary modules and functions
import React from 'react'; // Import React library
import { render, screen, fireEvent, act } from '@testing-library/react'; // Import testing functions from React Testing Library
import '@testing-library/jest-dom'; // Extend Jest matchers with custom matchers for DOM nodes
import { useAuth } from '../../contexts/AuthContext.js'; // Import AuthContext
import { ThemeProvider } from '../../contexts/ThemeContext.js';
import { useGraphContext } from '../../contexts/GraphContext.jsx';
import { createTheme } from '@mui/material';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Login from './Login.jsx'; // Import the Login component
import Dashboard from '../Dashboard/Dashboard.jsx';
import Signup from '../Signup/Signup.jsx';
import Main from '../Main/Main.jsx';
import About from '../About/About.jsx';
import Team from '../Team/Team.jsx';
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

// Describe the test suite for the Login component
describe('Login Component', () => {
  // Reset any mocked fetch calls before each test
  beforeEach(() => {
    fetch.resetMocks();
  });

  test('renders Login component correctly', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    //select components on login page to test for correct rendering
    const homeLinkNav = screen.getByRole('link', { name: /Home/i });
    const homeLinkIcon = screen.getByAltText(/Small Logo/i);
    const teamLink = screen.getByRole('link', { name: /Team/i });
    const aboutLink = screen.getByRole('link', { name: /About/i });
    const githubLink = screen.getByAltText(/GitHub/i);
    const username = screen.getByLabelText(/Username/i);
    const password = screen.getByLabelText(/Password/i);
    const mainImage = screen.getByAltText(/molecule image/i);
    const loginButton = screen.getByRole('button', { name: /login/i });
    const signupLink = screen.getByRole('link', { name: /have an account/i });

    // Verify selected fields are rendering properly
    expect(homeLinkNav).toBeInTheDocument();
    expect(homeLinkIcon).toBeInTheDocument();
    expect(teamLink).toBeInTheDocument();
    expect(aboutLink).toBeInTheDocument();
    expect(githubLink).toBeInTheDocument();
    expect(username).toBeInTheDocument();
    expect(password).toBeInTheDocument();
    expect(mainImage).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
    expect(signupLink).toBeInTheDocument();
  });
});

describe('Navigation tests for Login page', () => {
  //reset memory router before each navigation test
  beforeEach(() => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/' element={<Main />} />
          <Route path='/about' element={<About />} />
          <Route path='/team' element={<Team />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/dashboard' element={<Dashboard />} />
        </Routes>
      </MemoryRouter>
    );
  });

  // Test Navigating to Home/Main Route upon Icon Click
  test('Successfully navigates to Home/Main route using icon link', () => {
    const homeLinkIcon = screen.getByAltText(/Small Logo/i);
    fireEvent.click(homeLinkIcon);
    expect(screen.getByText(/Implementation in seconds/i)).toBeInTheDocument();
  });
  // Test Navigation to Home/Main upon NavBar Click
  test('Successfully navigates to Home/Main route using navbar link', () => {
    const homeLinkNav = screen.getByRole('link', { name: /Home/i });
    fireEvent.click(homeLinkNav);
    expect(screen.getByText(/Implementation in seconds/i)).toBeInTheDocument();
  });
  // Test Navigate to Team page upon click
  test('Successfully navigates to Team route on click', () => {
    const teamLink = screen.getByRole('link', { name: /Team/i });
    fireEvent.click(teamLink);
    expect(screen.getByText(/Meet the Team/i)).toBeInTheDocument();
  });
  // Test Navigate to About page upon click
  test('Successfully navigates to About route on click', () => {
    const aboutLink = screen.getByRole('link', { name: /About/i });
    fireEvent.click(aboutLink);
    expect(screen.getByText(/think about GraphQL/i)).toBeInTheDocument();
  });
  // Test Navigate to Signup upon click
  test('Successfully navigates to Signup route on click', () => {
    const signupLink = screen.getByRole('link', {
      name: /Don't have an account/i,
    });
    fireEvent.click(signupLink);
    expect(
      screen.getByRole('link', { name: /have an account/i })
    ).toBeInTheDocument();
  });
});
// Test for Successful Login
describe('Handles form submission and successfully logs in', () => {
  test('Successfully navigates to Dashboard route on login', async () => {
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
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/dashboard' element={<Dashboard />} />
          </Routes>
        </MemoryRouter>
      </ThemeProvider>
    );

    //select login button and simulate form entry
    const loginButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: 'test1' },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: '111111' },
    });

    //submit form and check for dashboard rendering
    await act(async () => {
      fireEvent.click(loginButton);
    });

    expect(
      screen.getByRole('link', { name: /Dashboard/i })
    ).toBeInTheDocument();
  });
});

