const jwt = require("jsonwebtoken");
const db = require("./models/userModels");
const JWT_SECRET = process.env.JWT_SECRET;

const createAuthToken = (user) => {
  const { userId, username } = user;
  return jwt.sign({ userId, username }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

const verifyAuthToken = async (authToken) => {
  // check if secret exists in environment
  if (!JWT_SECRET) throw Error("JWT_SECRET not set");
  // decode token
  // const { userId, username } = jwt.verify(authToken, JWT_SECRET);
  const decoded = jwt.verify(authToken, JWT_SECRET);
  console.log(decoded);
  if (decoded) console.log("Token Validated. Decoded:", decoded);
  // return decoded user
  return await db.queryUserId(decoded.userId);
};

module.exports = {
  createAuthToken,
  verifyAuthToken,
};
