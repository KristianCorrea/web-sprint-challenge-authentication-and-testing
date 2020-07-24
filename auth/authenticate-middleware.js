/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/

const jwt = require("jsonwebtoken");


module.exports = (req, res, next) => {

  const token = req.headers.authorization;
  console.log(req.headers.authorization)

  const secret = process.env.JWT_SECRET || "is it secret, is it safe?";
  if (token) {
        jwt.verify(token, secret, (error, decodedToken) => {
            if (error) {
                // the token is invalid
                res.status(401).json({ you: "Session Expired. Please re-login." });
            } else {
                req.decodedToken = decodedToken;

                next();
            }
        });
    } else {
        res.status(401).json({ message: "Please login to access this section." });
    }
};
