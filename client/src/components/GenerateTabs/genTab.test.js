import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import GenerateTab from './genTab';
import schemaGenerator from '../algorithms/schema_generator';
import resolverGenerator from '../algorithms/resolver_generator';

// Mock the schema and resolver generator functions
jest.mock('../algorithms/schema_generator');
jest.mock('../algorithms/resolver_generator');

// Mock the clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

describe('GenerateTab Component', () => {
  const mockNodes = [{ id: 'node1' }];
  const mockEdges = [{ id: 'edge1' }];
  const mockOnClose = jest.fn();

  beforeEach(() => {
    schemaGenerator.mockReturnValue(['Schema data']);
    resolverGenerator.mockReturnValue(['Resolver data']);
  });

  it('renders nothing when closed', () => {
    const { container } = render(<GenerateTab open={false} onClose={mockOnClose} nodes={mockNodes} edges={mockEdges} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders dialog when open', () => {
    render(<GenerateTab open={true} onClose={mockOnClose} nodes={mockNodes} edges={mockEdges} />);
    expect(screen.getByText('Tabs')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(<GenerateTab open={true} onClose={mockOnClose} nodes={mockNodes} edges={mockEdges} />);
    fireEvent.click(screen.getByText('Close'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('displays generated schema and resolver data', () => {
    render(<GenerateTab open={true} onClose={mockOnClose} nodes={mockNodes} edges={mockEdges} />);
    expect(screen.getByText('Schema data')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Resolver'));
    expect(screen.getByText('Resolver data')).toBeInTheDocument();
  });

  it('shows error snackbar when copy fails', async () => {
    navigator.clipboard.writeText.mockRejectedValueOnce(new Error('Copy failed'));
    render(<GenerateTab open={true} onClose={mockOnClose} nodes={mockNodes} edges={mockEdges} />);
    fireEvent.click(screen.getAllByTestId('ContentCopyIcon')[0]);
    await waitFor(() => {
      expect(screen.getByText('Failed to copy')).toBeInTheDocument();
    });
  });
});