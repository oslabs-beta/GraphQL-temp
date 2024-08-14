import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tabs,
  Tab,
  ButtonGroup,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import '../NodeSchema/schemavisualizer.scss';
import schemaGenerator from '../algorithms/schema_generator';
import resolverGenerator from '../algorithms/resolver_generator';
import './gentab.scss';
// Defined Custom Tab Panel to pass down probs and manage children component
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}
// a11yProps defined to enhance the accessiblity of tabs
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

// BasicTabs defined to hold inner tabs - child component
function BasicTabs({ generatedSchema, generatedResolver }) {
  const [value, setValue] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function handleCopy(text) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setSnackbarMessage('Copied to clipboard');
        setSnackbarOpen(true);
        // alert('copied');
      })
      .catch((err) => {
        setSnackbarMessage('Failed to copy');
        setSnackbarOpen(true);
        // alert('Failed to copy: ', err);
      });
  }

  function handleSnackbarClose() {
    setSnackbarOpen(false);
  }
  // JSX to construct Inner Tab - Child
  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label='basic tabs example'
        >
          <Tab label='TypeDef' {...a11yProps(0)} key='0' />
          <Tab label='Resolver' {...a11yProps(1)} key='1' />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <h1>TypeDefs</h1>
          <IconButton>
            <ContentCopyIcon
              onClick={() => handleCopy(generatedSchema.join('\n'))}
            />
          </IconButton>
        </Box>

        {generatedSchema.map((item, index) => (
          <Box
            key={crypto.randomUUID()}
            sx={{
              backgroundColor: '#2d2d2d',
              color: '#f8f8f2',
              overflowX: 'auto',
              '& pre, & code': {
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
              },
            }}
          >
            <pre style={{ margin: 0 }}>
              <code>{item}</code>
            </pre>
          </Box>
        ))}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <h1>Resolver</h1>
          <IconButton>
            <ContentCopyIcon
              onClick={() => handleCopy(generatedResolver.join('\n'))}
            />
          </IconButton>
        </Box>
        {generatedResolver.map((item, index) => (
          <Box
            key={crypto.randomUUID()}
            sx={{
              backgroundColor: '#2d2d2d',
              color: '#f8f8f2',
              overflowX: 'auto',
              '& pre, & code': {
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
              },
            }}
          >
            <pre style={{ margin: 0 }}>
              <code>{item}</code>
            </pre>
          </Box>
        ))}
      </CustomTabPanel>
      <Snackbar
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        autoHideDuration={3000}
      >
        <Alert onClose={handleSnackbarClose}>{snackbarMessage}</Alert>
      </Snackbar>
    </>
  );
}
// Defining Main Tab Functionality - contains BasicTabs
const GenerateTab = ({ open, onClose, nodes, edges }) => {
  // Storing ER of Schema Generator Function

  let generatedSchemaData = [];
  if (open) generatedSchemaData = schemaGenerator(nodes, edges);
  // Storing ER of Resolver Generator Function
  let generatedResolverData = [];
  if (open) generatedResolverData = resolverGenerator(nodes, edges);

  if (!open) return null;
  // JSX to construct GenerateTab popup tab
  return (
    <div className='generate-tab-container'>
      <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
        <DialogTitle>Tabs</DialogTitle>
        <DialogContent>
          <BasicTabs
            generatedSchema={generatedSchemaData}
            generatedResolver={generatedResolverData}
            key='0'
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color='primary'>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default GenerateTab;
