import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import About from './About.jsx';
import { BrowserRouter } from 'react-router-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Team from '../Team/Team.jsx';
import Main from '../Main/Main.jsx';

describe('About page', () => {
  //reset mocks before each test
  beforeEach(() => {
    fetch.resetMocks();
  });

  test('About component is properly rendered to page', () => {
    render(
      <BrowserRouter>
        <About />
      </BrowserRouter>
    );

    //select components on about page to test for correct rendering
    const mainHeader = screen.getByText(/think about GraphQL/i);
    const homeLinkNav = screen.getByRole('link', { name: /Home/i });
    const homeLinkIcon = screen.getByAltText(/Small Logo/i);
    const teamLink = screen.getByRole('link', { name: /Team/i });
    const githubLink = screen.getByAltText(/GitHub/i);

    // Verify selected fields are rendering properly
    expect(mainHeader).toBeInTheDocument();
    expect(homeLinkNav).toBeInTheDocument();
    expect(homeLinkIcon).toBeInTheDocument();
    expect(teamLink).toBeInTheDocument();
    expect(githubLink).toBeInTheDocument();
  });

  describe('Navigation tests for About page', () => {
    //reset memory router before each navigation test
    beforeEach(() => {
      render(
        <MemoryRouter initialEntries={['/about']}>
          <Routes>
            <Route path='/about' element={<About />} />
            <Route path='/team' element={<Team />} />
            <Route path='/' element={<Main />} />
          </Routes>
        </MemoryRouter>
      );
    });
    test('Successfully navigates to Team route on click', () => {
      const teamLink = screen.getByRole('link', { name: /Team/i });
      fireEvent.click(teamLink);
      expect(screen.getByText(/Meet the Team/i)).toBeInTheDocument();
    });
    test('Successfully navigates to Home/Main route using navbar link', () => {
      const homeLinkNav = screen.getByRole('link', { name: /Home/i });
      fireEvent.click(homeLinkNav);
      expect(
        screen.getByText(/Implementation in seconds/i)
      ).toBeInTheDocument();
    });
    test('Successfully navigates to Home/Main route using icon link', () => {
      const homeLinkIcon = screen.getByAltText(/Small Logo/i);
      fireEvent.click(homeLinkIcon);
      expect(
        screen.getByText(/Implementation in seconds/i)
      ).toBeInTheDocument();
    });
  });
});
