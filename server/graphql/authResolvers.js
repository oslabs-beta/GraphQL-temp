const db = require("../models/userModels");
const { GraphQLError } = require("graphql");
const bcrypt = require("bcryptjs");
const SALT_ROUNDS = process.env.NODE_ENV === "development" ? 3 : 10;

const auth = require("../auth");

const authResolvers = {
  Mutation: {
    async createUser(_, { newUser }, context) {
      // ensure user not currently signed in
      if (context.currentUser)
        throw new GraphQLError("User logged in. Cannot create new user.", {
          extensions: { code: "UNAUTHORIZED", statusCode: 401 },
        });
      const { username, email, password, role } = newUser;
      // hash the users password -- catch error on the front-end
      const hashWord = await bcrypt.hash(password, SALT_ROUNDS);
      const user = await db.createUser(username, email, hashWord, role);
      // generate JWT
      const token = auth.createAuthToken(user);
      return { user, token };
    },
    async loginUser(_, { currentUser }, context) {
      const { username, password } = currentUser;
      // ensure user not currently signed in
      if (context.currentUser)
        throw new GraphQLError("User logged in. Cannot login again.", {
          extensions: { code: "UNAUTHORIZED", statusCode: 401 },
        });
      // query user from databse
      const user = await db.queryUsername(username);
      // validate password -- catch error on front-end
      const isPasswordValid = await bcrypt.compare(password, user.hashWord);
      // invalid password
      if (!isPasswordValid) {
        throw new GraphQLError("Invalid username/password.", {
          extensions: {
            code: "UNAUTHORIZED",
            statusCode: 401,
          },
        });
      }
      // success
      // generate JWT
      const token = auth.createAuthToken(user);
      return { user, token };
    },
    async createGraph(_, { newGraph }, context) {
      // check that user authenticated
      if (!context.currentUser)
        throw newGraphQLError("User not logged in. Cannot create new graph.", {
          extensions: { code: "UNAUTHORIZED", statusCode: 401 },
        });
      const { userId, graphName, nodes, edges } = newGraph;
      const graph = await db.createGraph(userId, graphName, nodes, edges);
      return graph;
    },
    async saveGraph(_, { graph }, context) {
      // check that user authenticated
      if (!context.currentUser)
        throw newGraphQLError("User not logged in. Cannot save graph.", {
          extensions: { code: "UNAUTHORIZED", statusCode: 401 },
        });
      const { userId, graphName, nodes, edges } = graph;
      const updatedGraph = await db.saveGraph(userId, graphName, nodes, edges);
      return updatedGraph;
    },
  },
};

module.exports = authResolvers;
