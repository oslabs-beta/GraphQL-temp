const db = require("../models/userModels");
const { GraphQLError } = require("graphql");
const bcrypt = require("bcryptjs");
const SALT_ROUNDS = process.env.NODE_ENV === "development" ? 3 : 10;

const auth = require("../auth");

const authResolvers = {
  Mutation: {
    async createUser(_, { newUser }, context) {
      console.log("mutate createUser");
      // ensure user not currently signed in
      if (context.currentUser)
        throw new GraphQLError("User logged in. Cannot create new user.", {
          extensions: { code: "UNAUTHORIZED", statusCode: 401 },
        });
      const { username, email, password, role } = newUser;
      // hash the users password -- catch error on the front-end
      const hashWord = await bcrypt.hash(password, SALT_ROUNDS);
      const user = await db.createUser(username, email, hashWord, role);
      // success
      delete user.hashWord; // prevent password from being sent to client
      // generate JWT
      const token = auth.createAuthToken(user);
      return { user, token };
    },
    async loginUser(_, { userCreds }, context) {
      console.log("mutate loginUser");
      const { username, password } = userCreds;
      // ensure user not currently signed in
      // if (context.currentUser)
      //   throw new GraphQLError("User logged in. Cannot login again.", {
      //     extensions: { code: "UNAUTHORIZED", statusCode: 401 },
      //   });
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
      delete user.hashWord; // prevent password from being sent to client
      // generate JWT
      const token = auth.createAuthToken(user);
      return { user, token };
    },
    async validateSession(_, { token }, context) {
      console.log("mutate validateSesssion");
      // once it reaches this endpoint, we can assume that: no token, or token is valid
      // no user, so no token is saved
      if (!context.currentUser) {
        // return invalid session
        // TODO - not sure if should reutrn null or throw error
        // return null;
        throw GraphQLError("No authorization token.", {
          extensions: {
            code: "UNAUTHORIZED",
            statusCode: 401,
          },
        });
      } else {
        // token is valid
        // return valid session
        return { user: context.currentUser, token };
      }
    },
    async createGraph(_, { newGraph }, context) {
      console.log("mutate createGraph");
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
      console.log("mutate saveGraph");
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
