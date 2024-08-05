const db = require("../models/userModels");

const schemaResolvers = {
  Query: {
    // access single user dependent on userId
    async user(_, { userId }, context) {
      const user = await db.queryUserId(userId);
      if (!user)
        throw new GraphQLError("User not found.", {
          extensions: {
            code: "NOT_FOUND",
            statusCode: 404,
          },
        });
      return user;
    },
    // access single graph dependent on graphId
    async graph(_, { graphId }, context) {
      const graph = await db.queryGraph(graphId);
      if (!graph)
        throw new GraphQLError("Graph not found.", {
          extensions: {
            code: "NOT_FOUND",
            statusCode: 404,
          },
        });
      return graph;
    },
  },
  User: {
    // access subset of graphs that belong to the user
    async graphs(parent, _, context) {
      const graphs = await db.queryGraphs(parent.userId);
      return graphs;
    },
  },
  Graph: {
    // access user of graph
    async user(parent, _, context) {
      // console.log("parent", parent);
      const user = await db.queryUserId(parent.userId);
      return user;
    },
  },
};

module.exports = schemaResolvers;
