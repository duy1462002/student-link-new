const express = require("express");
const router = express.Router();
const zoomController = require("../controllers/zoomController");
const checkAuth = require("../middleware/checkAuth");

router.post("/schedule", checkAuth, zoomController.scheduleMeeting);

router.post("/link", checkAuth, zoomController.getMeetingLink);

router.post("/meetings", checkAuth, zoomController.getMeetingsByGroup);

router.post('/delete-meeting', checkAuth, zoomController.deleteMeeting);

module.exports = router;
