import React, { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useGraphContext } from '../../contexts/GraphContext';
import GraphCard from '../GraphCard/GraphCard';
import addGraph from '../../assets/logos/addGraph.png';
import './dashboardgrid.scss';

// graphQL
import graphqlClient from '../../graphql/graphqlClient';
import { GET_GRAPHS } from '../../graphql/queries';

// Defining Dashboard Grid upon specific user's graph list
const DashboardGrid = ({ handleModalOpen, handleModalClose }) => {
    const { graphList, setGraphList } = useGraphContext();
    const { username, userId } = useAuth();

    // fetch user's graphList
    useEffect(() => {
        const fetchGraphList = async () => {
            try {
                // fetch from database
                const response = await graphqlClient(GET_GRAPHS, {
                    userId: localStorage.getItem('userId'),
                });
                // success
                const data = response.data.data;
                const user = data.user;
                const { graphs } = user;
                setGraphList(graphs);
            } catch (err) {
                console.log(`Failed to fetch graph list for user: ${localStorage.getItem('username')}`);
                console.log("error:", err);
            }
        }
        fetchGraphList();
        return;
    }, []);

    const graphCards = graphList.map((graph) => {
        return <GraphCard key={crypto.randomUUID()} graphId={graph.graphId} graphName={graph.graphName}></GraphCard>
    })
    // JSX to define our Dashboard Grid div
    return (
        <div className="dashboard-grid">
            {/* <div className="add-graph-section">
                <button className="add-graph-button" onClick={handleModalOpen}>
                    <img src={addGraph} alt="Add Graph" />        
                </button>
                <p>Click here to create a new project</p>
            </div> */}
            <div className='new-graph-card graph-card' onClick={handleModalOpen}>+</div>
            {graphCards}
        </div>
    )
}

export default DashboardGrid