const path = require('path');
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
// const schema = require('./graphql/schema');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// static files
// app.use(express.static(path.join(__dirname, 'build')));
// app.use(express.static(path.join(__dirname, './../client/public')));

// graphQL
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// async function for Apollo graphQL server
const startServer = async () => {
  try {
    // apply Apollo GraphQL middleware
    await server.start()
    app.use('/graphql', cors(), express.json(), expressMiddleware(server));
  

    // Authorization Route
    const authRouter = require('./routes/authRouter');
    app.use('/api/auth', authRouter);

    // Graph Routes
    const graphRouter = require('./routes/graphRouter');
    app.use('/api/graph', graphRouter);

    // app.use(express.static(path.join(__dirname, './../client/public')));

    app.get("*", (req, res) => {
      console.log('req.url', req.url);
      // res.sendFile(path.join(__dirname, 'build', 'index.html'));
    });

    // Global error handler:
    app.use((err, req, res, next) => {
      console.log('GLOBAL ERROR HANDLER:', err);
      const defaultErr = {
        log: "Express error handler caught middleware error",
        status: 500,
        message: { err: "An error occurred" },
      };
      const errorObj = Object.assign({}, defaultErr, err);
      console.log(errorObj.log);
      return res.status(errorObj.status).json(errorObj.message);
    });

    app.listen(3000, () => {
      console.log("listening on port 3000");
    }); //listens on port 3000 -> http://localhost:3000/

  } catch (err) {
    console.log('Error starting the server:', err);
  }
}

startServer();

module.exports = app;