const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res
      .status(200)
      .json({ success: false, message: "Access token not found!" });
      return res.redirect('/login');

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      success: false,
      message: "Invalid token!",
    });
  }
};

module.exports = verifyToken