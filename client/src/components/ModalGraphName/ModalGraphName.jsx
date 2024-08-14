import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useAuth } from '../../contexts/AuthContext';
import { useGraphContext } from '../../contexts/GraphContext';

// graphQL
import graphqlClient from '../../graphql/graphqlClient';
import { CREATE_GRAPH } from '../../graphql/mutations';

// Modal will pop up only when user creates new graph
const ModalGraphName = (props) => {
    const navigate = useNavigate();
    const { authState, setAuthState } = useAuth();
    const { graphName, setGraphName } = useGraphContext();
    // const { graphId, setGraphId } = useGraphContext();
    const { modalVisibility, handleModalClose } = props;

    
    // Handle Graph Name Submittion
    const handleGraphNameSubmit = async () => {
        // send POST request to server
        const { userId } = authState;
        
        // mutation - createGraph
        try {
            const response = await graphqlClient(CREATE_GRAPH, {
                newGraph: {
                    userId,
                    graphName,
                    nodes: "",
                    edges: "",
                }
            });
            // success
            const graph = response.data.data.createGraph
            setGraphName(graph.graphName);

            return navigate(`/graph/${userId}/${graph.graphId}`);
        } catch (err) {
            console.error('Unable to create new graph', graphName);
            console.error(err);
        }
        console.log(`Graph "${graphName}" successfully created`);
        // hide modal
        // handleModalClose();
        return;
    }
    // Default Color 
    const colors = {
        'color-primary': '#C978FB',
        'color-secondary': '#64268A',
        'color-tertiary': '#31AFD4',
        'color-quaternary': '#093758',
        'color-black': '#190624',
        'color-white': '#FCFCFC',
    }
    // Default Color Theme
    const theme = createTheme({
        typography: {
            fontFamily: 'Nunito, Arial, sans-serif',
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        backgroundColor: '#C978FB',
                        fontFamily: 'Outfit',
                        boxShadow: 'none',
                        color: colors['color-white'],
                        marginTop: '1rem',
                        borderRadius: '.4em',
                        textTransform: 'none',
                        fontWeight: 700,
                        letterSpacing: '0.02rem',
                        fontSize: '1rem',
                        transition: 'all 200ms',
                        '&:hover': {
                            transform: 'translateY(-1px)',
                            backgroundColor: '#C978FB',
                            boxShadow: 'none',
                            transition: 'all 200ms'
                        }
                    }
                }
            }
        }
    })

    const boxStyle = {
        backgroundColor: colors['color-white'],
        display: 'flex',
        flexDirection: 'column',
        width: '600px',
        borderRadius: '.4em',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        p: '2rem',
        boxShadow: 8,
        '&:focus': {
            outline: 'none',
        }
    }

    const titleStyle = {
        fontWeight: 500,
        fontSize: '1rem',
    }
    // JSX to define Theme Component-Model Graph
    return (
        <ThemeProvider theme={theme}>
            <Modal
                className='modal'
                open={modalVisibility}
                onClose={handleModalClose}
            >
                <Box className='modal-box' sx={boxStyle}>
                    <Typography className='modal-text' sx={titleStyle}>
                        Please enter your new graph name:
                    </Typography>
                    <TextField
                        className='modal-input-field'
                        id='graphName'
                        label='Graph Name'
                        variant='outlined'
                        margin='normal'
                        value={graphName}
                        onChange={(e) => setGraphName(e.target.value)}
                        required
                    />
                    <Button variant='contained' onClick={handleGraphNameSubmit}>Submit</Button>
                </Box>
            </Modal>
        </ThemeProvider>
    )
}

export default ModalGraphName;