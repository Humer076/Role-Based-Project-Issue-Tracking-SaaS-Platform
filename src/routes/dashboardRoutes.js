const express = require("express");
const router = express.Router();
const { getDashboardStats, getRecentTasks } = require("../controllers/dashboardController");
const { verifyToken } = require("../middlewares/auth.middleware");

router.get("/stats", verifyToken, getDashboardStats);
router.get("/recent", verifyToken, getRecentTasks);

module.exports = router;
