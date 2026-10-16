
const Reservation = require("../models/Reservation");

const validStatuses = [
  "pending",
  "confirmed",
  "seated",
  "completed",
  "cancelled",
];

// Customer: create a reservation
exports.createReservation = async (req, res, next) => {
  try {
    const {
      customerName,
      customerPhone,
      date,
      time,
      partySize,
      notes,
    } = req.body;

    if (
      !customerName ||
      !customerPhone ||
      !date ||
      !time ||
      partySize === undefined ||
      partySize === null ||
      partySize === ""
    ) {
      return res.status(400).json({
        message:
          "Please provide name, phone, date, time, and party size",
      });
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        message: "Invalid reservation date",
      });
    }

    const size = Number(partySize);

    if (!Number.isInteger(size) || size < 1 || size > 20) {
      return res.status(400).json({
        message: "Party size must be between 1 and 20",
      });
    }

    if (
      typeof customerName !== "string" ||
      typeof customerPhone !== "string" ||
      typeof time !== "string"
    ) {
      return res.status(400).json({
        message: "Name, phone, and time must be text",
      });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const reservation = await Reservation.create({
      customer: req.user.id,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      date: parsedDate,
      time: time.trim(),
      partySize: size,
      notes: typeof notes === "string" ? notes.trim() : "",
    });

    return res.status(201).json({
      message: "Reservation created successfully",
      reservation,
    });
  } catch (error) {
    console.error(
      "Create reservation error:",
      error.stack || error
    );
    next(error);
  }
};

// Customer: view their own reservations
exports.getMyReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.find({
      customer: req.user.id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({ reservations });
  } catch (error) {
    console.error(
      "Get my reservations error:",
      error.stack || error
    );
    next(error);
  }
};

// Manager: view all reservations
exports.getAllReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.find()
      .populate("customer", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({ reservations });
  } catch (error) {
    console.error(
      "Get all reservations error:",
      error.stack || error
    );
    next(error);
  }
};

// Manager: update reservation status
exports.updateReservationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid reservation status",
        validStatuses,
      });
    }

    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!reservation) {
      return res.status(404).json({
        message: "Reservation not found",
      });
    }

    return res.status(200).json({
      message: "Reservation status updated",
      reservation,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid reservation ID",
      });
    }

    console.error(
      "Update reservation status error:",
      error.stack || error
    );
    next(error);
  }
};
