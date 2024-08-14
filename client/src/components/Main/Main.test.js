import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import About from '../About/About.jsx';
import Team from '../Team/Team.jsx';
import Signup from '../Signup/Signup.jsx';
import Login from '../Login/Login.jsx';
import Main from './Main.jsx';
import { useAuth } from '../../contexts/AuthContext';

//mock auth context
jest.mock('../../contexts/AuthContext');

//mock return values for auth context
const mockUseAuth = useAuth;
mockUseAuth.mockReturnValue({
  authState: { isAuth: false },
  setAuthState: jest.fn(),
})


describe('Main page', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  test('Main component is properly rendered to page', () => {
    render(
      <BrowserRouter>
        <Main />
      </BrowserRouter>
    );

    //select components on main page to test for correct rendering
    const mainHeader = screen.getByText(/Implementation in seconds/i);
    const homeLinkNav = screen.getByRole('link', { name: /Home/i });
    const homeLinkIcon = screen.getByAltText(/Small Logo/i);
    const teamLink = screen.getByRole('link', { name: /Team/i });
    const aboutLink = screen.getByRole('link', { name: /About/i });
    const githubLink = screen.getByAltText(/GitHub/i);
    const loginButton = screen.getByRole('button', {name: /Log In/i });
    const signupButtons = screen.getAllByRole('button', {name: /Sign Up/i });
    const mainImage = screen.getByAltText(/molecule image/i);

    //verify selected fields are rendering properly
    expect(mainHeader).toBeInTheDocument();
    expect(homeLinkNav).toBeInTheDocument();
    expect(homeLinkIcon).toBeInTheDocument();
    expect(teamLink).toBeInTheDocument();
    expect(aboutLink).toBeInTheDocument();
    expect(githubLink).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
    expect(signupButtons.length).toBeGreaterThan(0);
    expect(mainImage).toBeVisible();
  });

  describe('Navigation tests for Main page', () => {
    //reset memory router before each navigation test
    beforeEach(() => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path='/' element={<Main />} />
            <Route path='/about' element={<About />} />
            <Route path='/team' element={<Team />} />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
          </Routes>
        </MemoryRouter>
      );
    });

    test('Successfully navigates to Team route on click', () => {
      const teamLink = screen.getByRole('link', { name: /Team/i });
      fireEvent.click(teamLink);
      expect(screen.getByText(/Meet the Team/i)).toBeInTheDocument();
    });

    test('Successfully navigates to About route on click', () => {
      const aboutLink = screen.getByRole('link', { name: /About/i });
      fireEvent.click(aboutLink);
      expect(
        screen.getByText(/think about GraphQL/i)
      ).toBeInTheDocument();
    });

    test('Successfully navigates to Login route on click', () => {
      const loginButton = screen.getByRole('button', { name: /Log In/i });
      fireEvent.click(loginButton);
      expect(
        screen.getByText(/Don't have an account?/i)
      ).toBeInTheDocument();
    });

    test('Successfully navigates to Signup route on click', () => {
      const signupButtons = screen.getAllByRole('button', { name: /Sign Up/i });
      fireEvent.click(signupButtons[0]); // Click the first "Sign Up" button
      expect(screen.getByText(/Already have an account?/i)).toBeInTheDocument();
    });
    
  });
});
