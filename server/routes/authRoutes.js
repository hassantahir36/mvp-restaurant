
const express = require("express");
const router = express.Router();

const {
  register,
  login,
  promoteToManager,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);

// Admin-only: promote an existing user to manager role
// Protected by ADMIN_SECRET environment variable
router.post("/promote-manager", promoteToManager);

module.exports = router;