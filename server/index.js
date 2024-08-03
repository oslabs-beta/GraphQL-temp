const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

// define schema types
const schema = buildSchema(`
    type Query {
        user(userId: ID!): User
        graph(graphId: ID!): Graph
    }

    enum Role {
        USER
        ADMIN
    }

    type User {
        userId: ID!,
        username: String!,
        email: String,
        hashWord: String,
        role: Role,
        graphs: [Graph],
    }
    
    type Graph {
        graphId: ID!,
        user: User!,
        graphName: String!,
        nodes: String,
        edges: String,
    }
    
    type Mutation {
        createUser( newUser: createUserInput! ): createUserResult,
        createGraph( newGraph: createGraphInput! ): Graph,
        saveGraph( updatedGraph: saveGraphInput! ): Graph,
    }

    type createUserResult {
        userId: ID!,
        username: String!,
        email: String!,
    }

    input createUserInput {
        username: String!,
        email: String,
        hashWord: String!,
        role: Role,
    }

    input createGraphInput {
        userId: ID!,
        graphName: String!,
        nodes: String,
        edges: String,
    }

    input saveGraphInput {
        userId: ID!,
        graphName: String!,
        nodes: String!,
        edges: String!,
    }
`);

const root = { getHello: () => "Hello World!" };

// define authentication middleware
const authorize = (req, res, next) => {
  // get JWT from req.headers
  const authHeader = req.headers.authorization;
  // validate
  if (authHeader) {
    // if valid, attach to req.user
    const token = authHeader.split(" ")[1];
    jwt.verify(token, "secret_key", (err, user) => {
      if (err) {
        console.log(err); // log the error
        res.err = err;
        return res.sendStatus(403); // Forbidden
      } else {
        // success
        console.log("USER:", user);
        req.user = user;
        return next();
      }
    });
  } else {
    // else, missing auth header
    // continue bc user may be creating a new account
    // need to check for req.user in resolvers
    return next();
  }
};

// set up authorization middleware
app.use(authorize);

// graphql middleware
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
  })
);

app.listen(PORT, () => console.log(`Listening on Port ${PORT}`));

module.exports = app;
