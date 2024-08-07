const jwt = require("jsonwebtoken");

module.exports.verifyJwt = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    let isAllow = true, info;
    jwt.verify(token, process.env.jwtSecretKey, (err, decoded) => {
      // err.name === "TokenExpiredError"
      
      if (err) {
        isAllow = false;
      }

      info = decoded;
    })
    
    if (isAllow) {
      req.user = info;
      return next();
    }
  }
  
  return res.sendStatus(403);

}