const { loadFilesSync } = require("@graphql-tools/load-files");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const path = require("path");

const typeDefs = loadFilesSync(path.join(__dirname, "./schema.graphql"));

const authResolvers = require("./authResolvers");
const schemaResolvers = require("./schemaResolvers");
const resolvers = [authResolvers, schemaResolvers];

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

module.exports = schema;
