const jwt = require("jsonwebtoken");
const { jwtConfig } = require("../config/index");

module.exports = function () {
  return function (req, res, next) {
    const { authorization } = req.headers;

    if (!authorization) {
      res.status(500).send({
        message: "missing authorization in headers!",
      });
    }
    const token = authorization.split(" ")[1];
    if (!token) {
      res.status(500).send({
        message: "missing token in headers!",
      });
    }
    const tokenVerfy = jwt.verify(
      token,
      jwtConfig.secretKey,
      (err, verified) => {
        if (err) {
          console.log(err.message);
          if (err.message === "jwt expired") {
            res.status(500).send({
              message: "token expired!",
            });
            return;
          } else {
            res.status(500).send({
              message: "token invalid!",
            });
            return;
          }
        }
        return verified;
      }
    );
    if (tokenVerfy) {
      const previousBody = req.body;
      body: Object.assign(previousBody, {
        userProfile: {
          id: `${tokenVerfy.id}`,
          name: `${tokenVerfy.name}`,
          username: `${tokenVerfy.username}`,
          code: `${tokenVerfy.code}`,
          level: `${tokenVerfy.level}`,
          type: `${tokenVerfy.type}`,
        },
      });
      next();
    }
  };
};
