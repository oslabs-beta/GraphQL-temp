import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { GraphContext } from '../../contexts/GraphContext';
import Graph from './Graph';

// Mock the AuthorizedNavbar and UploadSqlSchema components
jest.mock('../AuthorizedNavbar/AuthorizedNavbar', () => {
  return function MockAuthorizedNavbar() {
    return <div data-testid="authorized-navbar">AuthorizedNavbar</div>;
  };
});

jest.mock('../UploadSqlSchema/UploadSqlSchema', () => {
  return function MockUploadSqlSchema() {
    return <div data-testid="upload-sql-schema">UploadSqlSchema</div>;
  };
});

// Mock the useGraphContext hook
jest.mock('../../contexts/GraphContext', () => ({
  useGraphContext: jest.fn(),
}));

describe('Graph Component', () => {
  const mockSetGraphName = jest.fn();

  beforeEach(() => {
    // Setup mock for useGraphContext
    require('../../contexts/GraphContext').useGraphContext.mockReturnValue({
      graphName: 'Test Graph',
      setGraphName: mockSetGraphName,
    });
  });

  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <Graph />
      </BrowserRouter>
    );
    expect(screen.getByTestId('authorized-navbar')).toBeInTheDocument();
    expect(screen.getByTestId('upload-sql-schema')).toBeInTheDocument();
  });

  it('uses the GraphContext', () => {
    render(
      <BrowserRouter>
        <Graph />
      </BrowserRouter>
    );
    expect(require('../../contexts/GraphContext').useGraphContext).toHaveBeenCalled();
  });
});