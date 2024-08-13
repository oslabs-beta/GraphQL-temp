// called from dashboard page
export const GET_GRAPHS = `
    query ($userId: ID!) {
        user (userId: $userId) {
            userId
            username
            graphs {
                graphId
                graphName
                nodes
                edges
            }
        }
    }
`;

// called from graph page
export const GET_SINGLE_GRAPH = `
    query ($graphId: ID!) {
        graph (graphId: $graphId) {
            graphId
            graphName
            nodes
            edges
        }
    }
`;
