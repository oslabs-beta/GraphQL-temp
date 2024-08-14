const express = require('express');
const graphRouter = express.Router();

const userController = require('../controllers/userController');
const graphController = require('../controllers/graphController');


graphRouter.get(
  '/:userId',
  userController.validateJWT,
  graphController.getGraphList,
  (req, res, next) => {
    // return all graphs in database with :userid -- expect from dashboard page
    // console.log('Reached GET /api/graph/:userId');
    return res.status(200).json(res.locals.user);
  }
);


graphRouter.post(
  '/:userId',
  userController.validateJWT,
  graphController.createGraph,
  (req, res, next) => {
    // console.log('Reached POST /api/graph/:userId');
    // payload inclues username, user_id, graph_name, graph_id
    return res.status(201).json(res.locals.user); // return new graphId
  }
);


graphRouter.put(
  '/:userId/:graphId',
  userController.validateJWT,
  graphController.saveGraph,
  (req, res, next) => {
    // save updated graph
    // req.body inclues username, userId, graphName, graphId, nodes, edges
    // console.log('Reached PUT /api/graph/:userId/:graphId');
    return res.status(200).json(res.locals.user);
  }
);


graphRouter.get(
  '/:userId/:graphId',
  userController.validateJWT,
  graphController.getGraph,
  (req, res, next) => {
    // retrieve specific graph
    // console.log('Reached GET /api/graph/:userId/:graphId');
    // payload inclues username, userId, graphName, graphId, nodes, edges
    return res.status(200).json(res.locals.user);
  }
);

module.exports = graphRouter;
