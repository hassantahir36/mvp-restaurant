const express = require("express");
const router = express.Router();

const {
createReservation,
getMyReservations,
getAllReservations,
updateReservationStatus,
} = require("../controllers/reservationController");

const {
protect,
managerOnly,
} = require("../middleware/authMiddleware");

// Customer routes
router.post("/", protect, createReservation);
router.get("/my", protect, getMyReservations);

// Manager-only routes
router.get("/", protect, managerOnly, getAllReservations);
router.patch("/:id/status", protect, managerOnly, updateReservationStatus);

module.exports = router;
