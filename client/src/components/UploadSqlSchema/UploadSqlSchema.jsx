import React, { useState, useCallback } from 'react';
import Typography from '@mui/material/Typography';
import { useDropzone } from 'react-dropzone';
import SchemaVisualizer from '../NodeSchema/SchemaVisualizer';

import './uploadsqlschema.scss'  // styles 
// import { useEffect } from 'react';  // for testing onDrop
// import samplePgDump from '../algorithms/sample_pg_dump.sql';  // for testing onDrop
import { useTheme } from '../../contexts/ThemeContext';

// Component for uploading SQL schema files and visualizing them
// This component serves as the entry point for users to input their database schemas
const UploadSqlSchema = () => {
  // State to store the contents of uploaded SQL files
  // Using an array allows for multiple file uploads
  const [sqlContents, setSqlContents] = useState([]);
  const { darkMode } = useTheme();

  // Callback function to handle file drops
  // This function is memoized to prevent unnecessary re-renders
  // and to maintain consistent behavior across renders
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      // Using FileReader allows us to read the contents of the file asynchronously
      // This prevents blocking the main thread with large file reads
      reader.onload = (e) => {
        setSqlContents((prevContents) => [...prevContents, e.target.result]);
      };
      reader.readAsText(file);
    });
  }, []);

  // Configuration for the dropzone
  // This setup allows for a better user experience by providing visual feedback
  // and restricting file types to SQL files
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/sql': ['.sql'],
      'text/plain': ['.sql'],
    },
    multiple: true,  // Allowing multiple file uploads for batch processing
  });

  return (
    <div className={`graph-container ${darkMode ? 'dark' : ''}`} style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
      {/* Dropzone area for file uploads */}
      {/* The styling changes based on drag state and dark mode for better UX */}
      <div className={`drop-box ${isDragActive ? 'isDragActive' : ''} ${darkMode ? 'dark' : ''}`} {...getRootProps()}>
        <input className='drop-box-input' {...getInputProps()} />
        <Typography className={`drop-box-text ${darkMode ? 'dark' : ''}`}>
          {isDragActive
            ? 'Drop SQL files here'
            : '+ Click or drag to add SQL files'}
        </Typography>
      </div>
      
      {/* SchemaVisualizer component to render the uploaded schema */}
      {/* This separation of concerns allows for modularity and easier maintenance */}
      <SchemaVisualizer sqlContents={sqlContents} style={{flexGrow: 1}} />
    </div>
  );
};

export default UploadSqlSchema;