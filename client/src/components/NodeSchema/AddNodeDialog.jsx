import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Grid,
  useTheme,
} from '@mui/material';
import pluralize from 'pluralize';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { useTheme as useCustomTheme } from '../../contexts/ThemeContext';

//NodeDialog component handles edits to node graph
const NodeDialog = ({
  open,
  onClose,
  onAddNode,
  onEditNode,
  editingNode = null,
  primaryKeys,
  relationships,
  handleSetEdges,
  tables,
  colorScheme,
}) => {
  //define state variables for component
  const [nodeName, setNodeName] = useState('');
  const [fields, setFields] = useState([]);
  const [newField, setNewField] = useState({
    name: '',
    type: 'String',
    required: false,
    isForeignKey: '',
  });
  const [isForeignKeyVisible, setIsForeignKeyVisible] = useState(false);

  //define themes for component
  const { darkMode } = useCustomTheme();
  const theme = useTheme();

  useEffect(() => {
    if (editingNode) {
      setNodeName(editingNode.data.label);
      setFields(
        editingNode.data.columns.fields.map((col) => ({
          name: col.name,
          type: col.type,
          required: col.required,
          isForeignKey: col.isForeignKey,
        }))
      );
    } else {
      setNodeName('');
      setFields([]);
    }
  }, [editingNode]);

  const handleAddField = () => {
    if (newField.name) {
      setFields([...fields, newField]);
      setNewField({
        name: '',
        type: 'String',
        required: false,
        isForeignKey: '',
      });
    }
  };

  const handleRemoveField = (index) => {
    const updatedFields = fields.filter((_, i) => i !== index);
    setFields(updatedFields);
  };

  const handleEditField = (index) => {
    setIsForeignKeyVisible(fields[index].isForeignKey);
    setNewField(fields[index]);
    handleRemoveField(index);
  };

  const handleSubmit = () => {
    if (nodeName && fields.length > 0) {
      const nodeData = { name: nodeName, fields };
      if (editingNode) {
        onEditNode(editingNode.id, nodeData);
      } else {
        onAddNode(nodeData);
      }
      setNodeName('');
      setFields([]);
      onClose();
    }
  };

  const dialogStyle = {
    paper: {
      backgroundColor: darkMode ? theme.palette.background.paper : '#fff',
      color: darkMode ? theme.palette.text.primary : theme.palette.text.primary,
    },
  };

  const textFieldStyle = {
    input: {
      color: darkMode ? theme.palette.text.primary : theme.palette.text.primary,
    },
    label: {
      color: darkMode
        ? theme.palette.text.secondary
        : theme.palette.text.secondary,
    },
  };
  //create primary key menu for edge creation
  const primaryKeyMenu = [];
  primaryKeys.forEach((pk) => {
    primaryKeyMenu.push(<MenuItem key={crypto.randomUUID()} value={pk}>{pk}</MenuItem>);
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='md'
      fullWidth
      PaperProps={{ style: dialogStyle.paper }}
    >
      <DialogTitle>{editingNode ? 'Edit Node' : 'Add New Node'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin='dense'
          label='Node Name'
          fullWidth
          value={nodeName}
          onChange={(e) => setNodeName(e.target.value)}
          sx={{ mb: 3, ...textFieldStyle }}
        />
        <List>
          {fields.map((field, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={field.name}
                secondary={`${field.type}${
                  field.required ? ' (NOT NULL)' : ''
                }`}
              />
              <ListItemSecondaryAction>
                <IconButton edge='end' onClick={() => handleEditField(index)}>
                  <EditIcon />
                </IconButton>
                <IconButton edge='end' onClick={() => handleRemoveField(index)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
        <Grid
          className='grid-container'
          sx={{ width: '100%' }}
          container
          spacing={2}
          alignItems='center'
        >
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label='Field Name'
              value={newField.name}
              onChange={(e) =>
                setNewField({ ...newField, name: e.target.value })
              }
              sx={textFieldStyle}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth variant='outlined'>
              <InputLabel id='type-select-label' sx={textFieldStyle.label}>
                Type
              </InputLabel>
              <Select
                labelId='type-select-label'
                value={newField.type}
                onChange={(e) =>
                  setNewField({ ...newField, type: e.target.value })
                }
                label='Type'
                sx={textFieldStyle.input}
              >
                <MenuItem value='Int'>Int</MenuItem>
                <MenuItem value='Float'>Float</MenuItem>
                <MenuItem value='String'>String</MenuItem>
                <MenuItem value='Boolean'>Boolean</MenuItem>
                <MenuItem value='ID'>ID</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={newField.required}
                  onChange={(e) =>
                    setNewField({ ...newField, required: e.target.checked })
                  }
                />
              }
              label='NOT NULL'
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={newField.isForeignKey || isForeignKeyVisible}
                  onChange={(e) => {
                    if (isForeignKeyVisible) {
                      //if user removes foreign key, remove associated edge from edges object and update field
                      setNewField({ ...newField, isForeignKey: '' });
                      handleSetEdges(
                        relationships.filter(
                          (edge) =>
                            !(
                              edge.source === nodeName &&
                              edge.sourceHandle === newField.name
                            )
                        )
                      );
                    }
                    //update conditional rendering
                    setIsForeignKeyVisible(!isForeignKeyVisible);
                  }}
                />
              }
              label='FOREIGN KEY'
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              variant='contained'
              color='primary'
              onClick={handleAddField}
              startIcon={<AddIcon />}
              fullWidth
            >
              Add Field
            </Button>
          </Grid>
        </Grid>
        <Grid
          className='grid-bottom-row'
          sx={{ width: '100%' }}
          container
          spacing={2}
          alignItems='center'
        >
          <Grid
            item
            sx={{ visibility: isForeignKeyVisible ? 'visible' : 'hidden' }}
            xs={12}
            sm={3}
          >
            <FormControl fullWidth variant='outlined'>
              <InputLabel id='fkey-select-label' sx={textFieldStyle.label}>
                References
              </InputLabel>
              <Select
                labelId='fkey-select-label'
                value={newField.isForeignKey}
                onChange={async (e) => {
                  //select current node
                  const currentNode = tables.filter(
                    (table) => table.id === nodeName
                  );
                  //update field with primary key choice
                  await setNewField({
                    ...newField,
                    isForeignKey: e.target.value,
                  });
                  const foreignKey = e.target.value;
                  const target = foreignKey.match(/(\w+)\.(\w+)/);
                  //add new edge
                  if (target) {
                    const [, dbTarget, targetField] = target;
                    const newRelationships = [...relationships];
                    newRelationships.push({
                      id: crypto.randomUUID(),
                      source: nodeName,
                      sourceHandle: newField.name,
                      dbSourceTable: currentNode.dbTableName,
                      target: pluralize
                        .singular(dbTarget)
                        .replace(/^./, dbTarget[0].toUpperCase()),
                      targetHandle: targetField,
                      dbTargetTable: dbTarget,
                      type: 'custom',
                      data: {
                        color:
                          colorScheme[
                            newRelationships.length % colorScheme.length
                          ],
                        label: `${newField.name} → ${targetField}`,
                        hidden: false,
                      },
                      animated: true,
                      style: { stroke: '#ff0000' },
                    });
                    await handleSetEdges(newRelationships);
                  }
                }}
                label='Foreign key'
                sx={textFieldStyle.input}
              >
                <MenuItem disabled value={newField.isForeignKey || ''}>
                  {'current: ' + newField.isForeignKey}
                </MenuItem>
                {primaryKeyMenu}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant='contained' color='primary'>
          {editingNode ? 'Save Changes' : 'Add Node'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NodeDialog;
