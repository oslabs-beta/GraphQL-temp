import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import UploadSqlSchema from './UploadSqlSchema';
import { ThemeProvider } from '../../contexts/ThemeContext';

// Mock the useDropzone hook
jest.mock('react-dropzone', () => ({
  useDropzone: () => ({
    getRootProps: () => ({}),
    getInputProps: () => ({}),
    isDragActive: false,
  }),
}));

// Mock the SchemaVisualizer component
jest.mock('../NodeSchema/SchemaVisualizer', () => ({ sqlContents }) => (
  <div data-testid="schema-visualizer">
    {sqlContents.map((content, index) => (
      <div key={index}>{content}</div>
    ))}
  </div>
));

const renderUploadSqlSchema = (darkMode = false) => {
  return render(
    <ThemeProvider value={{ darkMode }}>
      <UploadSqlSchema />
    </ThemeProvider>
  );
};

describe('UploadSqlSchema Component', () => {
  test('renders UploadSqlSchema component', () => {
    renderUploadSqlSchema();
    expect(screen.getByText('+ Click or drag to add SQL files')).toBeInTheDocument();
  });

  test('does not apply dark mode class when darkMode is false', () => {
    renderUploadSqlSchema(false);
    expect(screen.getByText('+ Click or drag to add SQL files').className).not.toContain('dark');
  });
});