import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from './Dashboard';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { BrowserRouter } from 'react-router-dom';

// Mock the child components
jest.mock('../AuthorizedNavbar/AuthorizedNavbar', () => () => <div data-testid="authorized-navbar">Mocked Navbar</div>);
jest.mock('../DashboardGrid/DashboardGrid', () => ({ handleModalOpen }) => (
  <div data-testid="dashboard-grid">
    Mocked DashboardGrid
    <button onClick={handleModalOpen}>Open Modal</button>
  </div>
));
jest.mock('../ModalGraphName/ModalGraphName', () => ({ modalVisibility, handleModalClose }) => (
  modalVisibility ? <div data-testid="modal-graph-name">Mocked Modal <button onClick={handleModalClose}>Close</button></div> : null
));

const renderDashboard = (darkMode = false) => {
  return render(
    <BrowserRouter>
      <ThemeProvider value={{ darkMode }}>
        <Dashboard />
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('Dashboard Component', () => {
  test('renders Dashboard with correct title', () => {
    renderDashboard();
    expect(screen.getByText('Your Saved Graphs')).toBeInTheDocument();
  });

  test('renders AuthorizedNavbar', () => {
    renderDashboard();
    expect(screen.getByTestId('authorized-navbar')).toBeInTheDocument();
  });

  test('renders DashboardGrid', () => {
    renderDashboard();
    expect(screen.getByTestId('dashboard-grid')).toBeInTheDocument();
  });

  test('opens modal when "Open Modal" button is clicked', () => {
    renderDashboard();
    fireEvent.click(screen.getByText('Open Modal'));
    expect(screen.getByTestId('modal-graph-name')).toBeInTheDocument();
  });

  test('closes modal when "Close" button in modal is clicked', () => {
    renderDashboard();
    fireEvent.click(screen.getByText('Open Modal'));
    fireEvent.click(screen.getByText('Close'));
    expect(screen.queryByTestId('modal-graph-name')).not.toBeInTheDocument();
  });

  test('does not apply dark mode class when darkMode is false', () => {
    renderDashboard(false);
    expect(screen.getByText('Your Saved Graphs').className).not.toContain('dark');
    expect(screen.getByTestId('dashboard-grid').parentElement.className).not.toContain('dark');
  });
});