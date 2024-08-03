const { makeExecutableSchema } = require("@graphql-tools/schema");
const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");

// create the schema
const schema = makeExecutableSchema({
  typeDefs: typeDefs,
  resolvers: resolvers,
});

module.exports = schema;
