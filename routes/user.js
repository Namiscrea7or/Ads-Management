const express = require("express");
const router = express.Router();
const argon2 = require("argon2");
const verifyToken = require("../middleware/auth");

router.get("/info", verifyToken, async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.userId });
      if (!user) {
        return res.status(200).json({
          success: false,
          message: "User not found",
        });
      }
      res.json({
        success: true,
        email: user.email,
        full_name: user.full_name,
        dob: user.dob,
        role: user.role,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  });