const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const checkAuth = require("../middleware/checkAuth");
const chatValidator = require("../middleware/schemaValidators/chatValidator");
const chechRoom = require("../middleware/chechRoom");

router.post("/getChatRooms/", checkAuth, chatController.getChatRooms);

router.post(
  "/getMessagesForRoom",
  checkAuth,
  chatValidator.getMessagesForRoom,
  chatController.getMessagesForRoom
);

router.post(
  "/sendImage",
  checkAuth,
  chatController.upload,
  chatValidator.sendImage,
  chechRoom,
  chatController.createImageMessage
);

router.post(
  "/sendFile",
  checkAuth, // Kiểm tra xác thực
  chatController.upload, // Middleware xử lý upload tài liệu
  chatValidator.sendFile, // Validator cho việc gửi file
  chechRoom, // Middleware kiểm tra quyền truy cập vào room
  chatController.createFileMessage // Controller tạo tin nhắn file
);

router.post(
  "/call",
  checkAuth,
  chatValidator.handleCall,
  chechRoom,
  chatController.handleCall
);

router.post(
  "/answer",
  checkAuth,
  chatValidator.answer,
  chechRoom,
  chatController.answer
);

router.post(
  "/sendMessage",
  checkAuth,
  chatValidator.sendMessage,
  chechRoom,
  chatController.sendMessage
);

router.post(
  "/readMessages",
  checkAuth,
  chatValidator.readMessages,
  chechRoom,
  chatController.readMessages
);

module.exports = router;
