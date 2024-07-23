const { Pool } = require('pg');
require('dotenv').config();

const PG_URI = process.env.SQL_DATABASE_URI;

const pool = new Pool({
  connectionString: PG_URI,
  ssl: {
    rejectUnauthorized: false,
  },
});

const db = {}

db.query = (text, params, callback) => {
  console.log('Executed query:', text);
  return pool.query(text, params, callback);
}

db.testConnection = async () => {
  try {
    await pool.query('SELECT 1');
    console.log('Successfully connected to the database');
  } catch (err) {
    console.error('Error connecting to the database', err);
  }
}

// for GraphQL resolvers
db.queryUser = async (userId) => {
  const params = [userId];
  const query = 'SELECT * FROM users WHERE user_id = $1';
  const response = await db.query(query, params);
  // need to rename response obj variables
  const user = {
    userId: response.rows[0].user_id,
    username: response.rows[0].username,
    email: response.rows[0].email,
    hashWord: response.rows[0].password,
    role: response.rows[0].role,
  }
  return user;
}

db.queryGraph = async (graphId) => {
  const params = [graphId];
  const query = 'SELECT * FROM graphs WHERE graph_id = $1';
  const response = await db.query(query, params);
  // need to rename response obj variables
  const graph = {
    graphId: response.rows[0].graph_id,
    userId: response.rows[0].user_id,
    graphName: response.rows[0].graph_name,
    nodes: response.rows[0].nodes,
    edges: response.rows[0].edges,
  }
  return graph;
}

db.queryGraphs = async (userId) => {
  const params = [userId];
  const query = 'SELECT * FROM graphs WHERE user_id = $1';
  const response = await db.query(query, params);
  const graphs = [];
  // need to loop over response to rename variables
  for (let i = 0; i < response.rows.length; i++) {
    graphs.push({
      graphId: response.rows[i].graph_id,
      userId: response.rows[i].user_id,
      graphName: response.rows[i].graph_name,
      nodes: response.rows[i].nodes,
      edges: response.rows[i].edges,
    })
  }
  return graphs;
}

// GraphQL Mutations
db.createUser = async (username, email, hashWord, role) => {
  // create new user
  const params = [username, email, hashWord, role]
  const query = `INSERT INTO users(username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *`
  const response = await db.query(query, params);  // errors caught in controller
  // success
  // TODO - should we return hashWord and role as well? for full graph functionality?
  return {
    userId: response.rows[0].user_id,
    username: response.rows[0].username,
    email: response.rows[0].email,
  }
}

db.createGraph = async (userId, graphName, nodes, edges) => {
  // create new graph
  const params = [userId, graphName, nodes, edges];
  console.log('-- ------------params:', params)
  const query = `
    INSERT INTO graphs(user_id, graph_name, nodes, edges)
    VALUES ($1, $2, $3, $4)
    RETURNING *`;
  const response = await db.query(query, params);
  // success
  return {
    graphId: response.rows[0].graph_id,
    // user?
    graphName: response.rows[0].user,
    nodes: response.rows[0].nodes,
    edges: response.rows[0].edges,
  }
}

db.saveGraph = async (userId, graphName, nodes, edges) => {
  // save functionality for graph
  const params = [graphName, nodes, edges, graphId, userId];
  const query = `
    UPDATE graphs
    SET graph_name = $1, nodes = $2, edges = $3
    WHERE graph_id = $4 AND user_id = $5
    RETURNING *`
  const response = await db.query(query, params);
  // success
  return {
    // userId: response.rows[0].user_id,
    graphName: response.rows[0].graph_name,
    graphId: response.rows[0].graph_id,
    nodes: response.rows[0].nodes,
    edges: response.rows[0].edges,
  }
}

// export an object with query property that returns an invocation of pool.query
// require it in controller to be the access point to our database
module.exports = db;