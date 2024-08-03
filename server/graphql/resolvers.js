const db = require("../models/userModels"); // Assume you have a database module for data fetching

const resolvers = {
  Query: {
    // access single user dependent on userId
    async user(_, { userId }) {
      const user = await db.queryUser(userId);
      return user;
    },
    // access single graph dependent on graphId
    async graph(_, { graphId }) {
      const graph = await db.queryGraph(graphId);
      return graph;
    },
  },
  User: {
    // access subset of graphs that belong to the user
    async graphs(parent) {
      const graphs = await db.queryGraphs(parent.userId);
      return graphs;
    },
  },
  Mutation: {
    // async createUser(_, { username, email, hashWord, role }) {
    async createUser(_, { newUser }) {
      const { username, email, hashWord, role } = newUser;
      const user = await db.createUser(username, email, hashWord, role);
      return user;
    },
    async createGraph(_, { newGraph }) {
      const { userId, graphName, nodes, edges } = newGraph;
      const graph = await db.createGraph(userId, graphName, nodes, edges);
      return graph;
    },
    async saveGraph(_, { graph }) {
      const { userId, graphName, nodes, edges } = graph;
      const updatedGraph = await db.saveGraph(userId, graphName, nodes, edges);
      return updatedGraph;
    },
  },
};

module.exports = resolvers;
