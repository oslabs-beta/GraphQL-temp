import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './graphcard.scss'
// GraphCard component, passed in with graphID & graphName
const GraphCard = ({graphId, graphName}) => {
    const navigate = useNavigate();
    const { authState } = useAuth();
    // Handling click functionality to navigate to graph
    const handleClick = () => {
        // navigate to appropriate graph
        return navigate(`/graph/${authState.userId}/${graphId}`);
    }

    return (
        <div className='graph-card' onClick={() => handleClick()}>{graphName}</div>
    )
}

export default GraphCard