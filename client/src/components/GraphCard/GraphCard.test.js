import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import GraphCard from './GraphCard';

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

// Mock the useAuth hook
jest.mock('../../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('GraphCard Component', () => {
  const mockNavigate = jest.fn();
  const mockAuthState = {
    userId: 'testUserId',
  };

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
    useAuth.mockReturnValue({ authState: mockAuthState });
  });

  it('renders with correct graph name', () => {
    render(<GraphCard graphId="123" graphName="Test Graph" />);
    expect(screen.getByText('Test Graph')).toBeInTheDocument();
  });

  it('navigates to correct URL when clicked', () => {
    render(<GraphCard graphId="123" graphName="Test Graph" />);
    const card = screen.getByText('Test Graph');
    fireEvent.click(card);
    expect(mockNavigate).toHaveBeenCalledWith('/graph/testUserId/123');
  });

  it('uses authState from useAuth hook', () => {
    render(<GraphCard graphId="123" graphName="Test Graph" />);
    const card = screen.getByText('Test Graph');
    fireEvent.click(card);
    expect(useAuth).toHaveBeenCalled();
  });

  it('applies correct CSS class', () => {
    render(<GraphCard graphId="123" graphName="Test Graph" />);
    const card = screen.getByText('Test Graph');
    expect(card).toHaveClass('graph-card');
  });

  it('renders correctly with different props', () => {
    render(<GraphCard graphId="456" graphName="Another Graph" />);
    expect(screen.getByText('Another Graph')).toBeInTheDocument();
  });

  it('handles click event when auth state changes', () => {
    useAuth.mockReturnValue({ authState: { userId: 'newUserId' } });
    render(<GraphCard graphId="123" graphName="Test Graph" />);
    const card = screen.getByText('Test Graph');
    fireEvent.click(card);
    expect(mockNavigate).toHaveBeenCalledWith('/graph/newUserId/123');
  });
});