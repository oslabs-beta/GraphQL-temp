const db = require('../models/userModels');

const graphController = {};

graphController.createGraph = async (req, res, next) => {
    // create new graph in database
    const { userId, graphName } = req.body;
    // console.log('userId:', userId);
    // console.log('graphName:', graphName);
    // console.log('graphName === undefined:', graphName === "");
    if (!userId || !graphName) {
        return res.status(422).json({ error: 'Missing required parameters' });
    }
    const nodeString = '', edgeString = '';  // initialize as empty

    // const params = [userId, graphName, nodeString, edgeString];
    // const query = `
    //     INSERT INTO graphs(user_id, graph_name, nodes, edges)
    //     VALUES ($1, $2, $3, $4)
    //     RETURNING *`;
    // try {
    //     const newGraph = await db.query(query, params);
    //     // success
    //     res.locals.user.graphId = newGraph.rows[0].graph_id;
    //     res.locals.user.graphName = newGraph.rows[0].graph_name;
    //     return next();
    // } catch (err) {
    //     // fail
    //     console.log(err);
    //     return next({
    //         log: 'Error in graphController.createGraph',
    //         message: `Unable to create new graph for user ${res.locals.user.username} and graph name ${graphName}`,
    //         status: 409,
    //     });
    // }

    // graphQL layer
    try {
        const newGraph = await db.createGraph(userId, graphName, nodeString, edgeString);
        // success
        res.locals.user.graphId = newGraph.graphId;
        res.locals.user.graphName = newGraph.graphName;
        return next();
    } catch (err) {
        // fail
        console.log(err);
        return next({
            log: 'Error in graphController.createGraph',
            message: `Unable to create new graph for user ${res.locals.user.username} and graph name ${graphName}`,
            status: 409,
        });
    }
}

graphController.getGraph = async (req, res, next) => {
    // query database for requested graph
    const { userId, graphId } = req.params;
    // Check if parameters are undefined
    if (!userId || !graphId) {
        return res.status(422).json({ error: 'Missing required parameters' });
    }

    const params = [graphId, userId];
    const query = `SELECT * FROM graphs WHERE graph_id = $1 AND user_id = $2`
    try {
        const graph = await db.query(query, params);
        // success
        res.locals.user.graphId = graph.rows[0].graph_id;
        res.locals.user.graphName = graph.rows[0].graph_name;
        res.locals.user.nodes = graph.rows[0].nodes;
        res.locals.user.edges = graph.rows[0].edges;
        return next();
    } catch (err) {
        // fail
        console.log(err);
        return next({
            log: 'Error in graphController.getGraph',
            message: 'Unable to retrieve graph from database',
            status: 500,
        })
    }
}

graphController.getGraphList = async (req, res, next) => {
    // get userId from res.locals
    const { userId } = res.locals.user;

    const params = [ userId ];
    const query =  `SELECT * FROM graphs WHERE user_id = $1`;
    
    try {
        const dbResponse = await db.query(query, params);
        const graphList = [];
        let row;
        for (let i = 0; i < dbResponse.rows.length; i++) {
            row = dbResponse.rows[i];
            graphList.push({
                graph_id: row['graph_id'],
                graph_name: row['graph_name'],
                // TODO - insert graph picture here
            })
        }
        res.locals.user.graphList = graphList;
    } catch (err) {
        console.log(err);
        return next({
            log: 'Error in graphController.getGraphList',
            message: `Unable to pull graphlist for userId: ${userId}`,
            status: 500,
        });
    }

    return next();
}

graphController.saveGraph = async (req, res, next) => {
    // update graph in database
    // destructure request payload
    const { userId, graphName, graphId, nodes, edges } = req.body;
    //  check if thee parameters are undefined
    if (!userId || !graphName || !graphId || !nodes || !edges) {
        return res.status(422).json({ error: 'Missing required parameters' });
    }
    // Update the database
    // const params = [graphName, nodes, edges, graphId, userId];
    // const query = `
    // UPDATE graphs
    // SET graph_name = $1, nodes = $2, edges = $3
    // WHERE graph_id = $4 AND user_id = $5
    // RETURNING *`
    // try {
    //     const updatedGraph = await db.query(query, params);
    //     // success
    //     res.locals.user.userId = updatedGraph.rows[0].user_id;
    //     res.locals.user.graphName = updatedGraph.rows[0].graph_name;
    //     res.locals.user.graphId = updatedGraph.rows[0].graph_id;
    //     res.locals.user.nodes = updatedGraph.rows[0].nodes;
    //     res.locals.user.edges = updatedGraph.rows[0].edges;
    //     return next();
    // } catch (err) {
    //     console.log(err);
    //     return next({
    //         log: 'Error in graphController.saveGraph',
    //         message: 'Unable to update graph in database',
    //         status: 500,
    //     })
    // }

    // graphQL layer
    try {
        const updatedGraph = await db.saveGraph(query, params);
        // success
        res.locals.user.userId = updatedGraph.user_id;
        res.locals.user.graphName = updatedGraph.graph_name;
        res.locals.user.graphId = updatedGraph.graph_id;
        res.locals.user.nodes = updatedGraph.nodes;
        res.locals.user.edges = updatedGraph.edges;
    } catch (err) {
        console.log(err);
        return next({
            log: 'Error in graphController.saveGraph',
            message: 'Unable to update graph in database',
            status: 500,
        })
    }
}

module.exports = graphController
