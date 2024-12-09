const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const Message = new mongoose.Schema({
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true }, // ID của phòng chat
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // ID của người gửi
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // ID của người nhận
  text: {
    type: String,
    trim: true,
    minlength: 1
  },
  messageType: {
    type: String,
    required: true,
    enum: ["text", "image", "file", "call", "document"] // Các loại tin nhắn được hỗ trợ
  },
  photo: String, // Đường dẫn của ảnh (nếu có)
  file: String,
  read: { type: Boolean, default: false }, // Tin nhắn đã đọc hay chưa
  createdAt: { type: Date, default: Date.now } // Thời gian tạo tin nhắn
});

module.exports = mongoose.model("Message", Message);
