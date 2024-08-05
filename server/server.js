const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");
const PORT = process.env.PORT || 3000;

const schema = require("./graphql/schema");
const auth = require("./auth");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

// define authentication middleware -- mutates req object passed as graph context
const authorize = (req, res, next) => {
  console.log("req.headers.authorization:", req.headers.authorization);
  // get JWT from req.headers
  // const authToken = req.headers.authorization?.split(" ")[1];
  const authToken = req.headers.authorization?.split(" ")[1];
  if (!authToken || authToken === "null") {
    console.error("Missing Auth Token");
    // missing auth header
    // continue bc user may be creating a new account
    // need to check for req.user in resolvers
    req.currentUser = null;
    return next();
  } else {
    // validate
    console.log("Validating JWT...");
    try {
      req.currentUser = auth.verifyAuthToken(authToken);
      return next();
    } catch (err) {
      console.error("JWT verification failed:", err);
      res.status(401).json({ error: "Unauthorized" });
    }
  }
};

// set up authorization middleware
app.use(authorize);

// graphql middleware
app.use(
  "/api",
  graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === "development",
    customFormatErrorFn: (err) => {
      return {
        message: err.message,
        locations: err.locations,
        path: err.path,
        statusCode: err.originalError && err.originalError.statusCode,
      };
    },
  })
);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

module.exports = app;
