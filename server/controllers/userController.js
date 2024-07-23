const bcrypt = require('bcryptjs'); // Import bcryptjs library for hashing passwords
const saltRounds = 10; // Define number of salt rounds for hashing
const db = require('../models/userModels'); // Import database models for querying

const jwt = require('jsonwebtoken'); // Import jsonwebtoken library for JWT creation/validation
const JWT_SECRET = 'moleQLar'; // Define a secret key for signing JWTs
const userController = {}; // Initialize an empty userController object

// Middleware for hashing the password
userController.hashing = async (req, res, next) => {
  const { password } = req.body; // Extract password from request body
  try {
    const salt = await bcrypt.genSalt(saltRounds); // Generate salt with defined rounds
    const hashWord = await bcrypt.hash(password, salt); // Hash the password using the generated salt
    res.locals.hashWord = hashWord; // Store the hashed password in res.locals for later use
    return next(); // Proceed to the next middleware
  } catch (err) {
    return next({
      // Error handling
      log: 'Error in userController.hashing',
      message: { err: 'Error hashing password' },
    });
  }
};

// Middleware for creating a new user
userController.createUser = async (req, res, next) => {
  const { username, email } = req.body; // Extract username and email from request body
  const hashWord = res.locals.hashWord; // Retrieve hashed password from res.locals
  // const role = req.body; // TODO - accept role from front end
  const role = 'USER';

  // TODO - check that username doesn't already exist - Brian
  // try {
  //   const userCheck = await db.query('SELECT * FROM users WHERE username = $1', [username]);
  //   if (userCheck.rows.length > 0) {
  //     return res.status(409).json({ error: 'Username already exists' });
  //   }
  // } catch (err) {
  //   return next({
  //     log: 'Error in userController.createUser - checking for existing username',
  //     message: { err: 'Error checking for existing username' },
  //   });
  // }
  // TODO - create unique user id for the new user

  // Insert credentials into database
  // const params = [username, hashWord, email]; // Define parameters for SQL query
  // const query = `INSERT INTO users(username, password, email) VALUES ($1, $2, $3) RETURNING *`; // Define SQL query string
  // db.query(query, params) // Execute SQL query with parameters
  //   .then((createdUser) => {
  //     // Handle successful user creation
  //     res.locals.user = {
  //       ...createdUser.rows[0], // Store created user information in res.locals
  //       userId: createdUser.rows[0].user_id,
  //     };
  //     return next(); // Proceed to the next middleware
  //   })
  //   .catch((err) => {
  //     // Error handling
  //     console.log(err);
  //     return next({
  //       log: 'Error in userController.createUser',
  //       status: 500,
  //       message: { err: 'Error creating user' },
  //     });
  //   });

  // graphQL layer
  try {
    const user = await db.createUser(username, email, hashWord, role);
    // success
    res.locals.user = user;
    return next();
  } catch (err) {
    console.log(err);
    return next({
      log: 'Error in userController.createUser',
      status: 500,
      message: { err: 'Error creating user' },
    })
  }
};

// Middleware for logging in a user
userController.loginUser = async (req, res, next) => {
  const { username, password } = req.body; // Extract username and password from request body
  const loginQuery = `SELECT * FROM users WHERE username = '${username}'`; // Define SQL query string
  console.log('username:', username);
  console.log('password:', password);

  // Error checking for missing username or password
  if (!username || !password) {
    return next({
      log: 'Error in userController.loginUser, username and password are required',
      message: 'username and password are required',
      status: 400,
    });
  }

  // Validate credentials
  try {
    const result = await db.query(loginQuery); // Query database for user
    const dbPassword = result.rows[0].password; // Save password from database

    // Validate password
    const isMatch = await bcrypt.compare(password, dbPassword); // Compare provided password with stored hash
    if (!isMatch) {
      // Invalid credentials
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Send back user info to the client
    res.locals.user = {
      username: username,
      userId: result.rows[0].user_id,
    }
    return next();
  } catch (err) {
    console.log(err);
    return next({
      log: `Error in userController.loginUser, ${err}`,
      message: { err: 'Error occurred in post request to /login' },
      status: 500,
    });
  }
};

// Middleware for signing a JWT
userController.signJWT = (req, res, next) => {
  console.log('userController.signJWT - signing JWT');

  // Generate JWT
  // State
  const state = {
    ...res.locals.user, // Include user information in the state
  };

  // Sign token
  const token = jwt.sign(state, JWT_SECRET, { expiresIn: '1h' }); // Create a JWT with the state and secret key

  // Add token to response header
  res.setHeader('authorization', `Bearer ${token}`); // Add the token to the response header
  return next(); // Proceed to the next middleware
};

// Middleware for validating a JWT
userController.validateJWT = async (req, res, next) => {
  console.log('userController.validateJWT');

  // Check that JWT exists in client's local storage
  const token = req.headers['authorization'].replace('Bearer ', ''); // Extract token from authorization header
  if (token === 'null' && !JSON.parse(token)) {
    console.log('No token found');
    // Denied - no token
    res.locals.user = null;
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // Check that token is valid
  try {
    const decoded = jwt.verify(token, JWT_SECRET); // Verify the token using the secret key

    // Success - send username back to the client
    res.locals.user = {
      username: decoded.username,
      userId: decoded.userId,
    }
    return next();
  } catch (err) {
    console.log('userController - err.name:', err.name);

    // Handle specific JWT errors
    if (err.name === 'TokenExpiredError') {
      return res
        .status(401)
        .json({ message: 'Token expired, authorization denied' });
    } else if (err.name === 'JsonWebTokenError') {
      return res
        .status(401)
        .json({ message: 'Invalid token, authorization denied' });
    } else {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
};

module.exports = userController; // Export userController object
