const mongoose = require("mongoose");
const ChatRoom = mongoose.model("ChatRoom");
const Message = mongoose.model("Message");
const User = mongoose.model("User");
const messageHandler = require("../handlers/messageHandler");
const path = require("path");
const uuidv4 = require("uuid/v4");
const multer = require("multer");
const Jimp = require("jimp");
const fs = require("fs");

// Check File Type
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let destinationPath;

    if (file.mimetype.startsWith("image/")) {
      destinationPath = path.join(__dirname, "..", "public", "images", "chat-images");
    } else {
      destinationPath = path.join(__dirname, "..", "public", "documents", "chat-documents");
    }

    // Kiểm tra và tạo thư mục nếu không tồn tại
    fs.mkdir(destinationPath, { recursive: true }, (err) => {
      if (err) throw err;
      cb(null, destinationPath);
    });
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const filename = `${timestamp}${ext}`;
    cb(null, filename);
  },
});

// Cấu hình multer với các giới hạn và kiểm tra file
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 10 }, // Giới hạn kích thước tệp: 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/",
      "application/pdf",
      "text/plain",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (allowedTypes.some((type) => file.mimetype.startsWith(type))) {
      cb(null, true);
    } else {
      cb(new Error("Only images, PDFs, and documents (txt, doc, docx) are allowed"));
    }
  },
}).fields([
  { name: "image", maxCount: 1 },
  { name: "document", maxCount: 1 },
]);

exports.upload = (req, res, next) => {
  upload(req, res, err => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (!req.files || (!req.files.image && !req.files.document)) {
      return res.status(400).json({ message: "Please upload a file" });
    }

    const file = req.files.image ? req.files.image[0] : req.files.document[0];
    const isImage = /jpeg|jpg|png|gif/.test(file.mimetype);
    
    req.body.fileType = isImage ? "image" : "document";
    
    if (isImage) {
      req.body.photo = file.filename;
    } else {
      req.body.document = file.filename;
    }

    next();
  });
};


exports.createImageMessage = (req, res) => {
  new Message({
    roomId: req.body.roomId,
    sender: req.userData.userId,
    receiver: JSON.parse(req.body.receiver)._id,
    photo: req.body.photo,
    messageType: "image"
  })
    .save()
    .then(result => {
      ChatRoom.findByIdAndUpdate(
        { _id: req.body.roomId },
        { $inc: { messages: 1 } }
      )
        .then(result => console.log(result))
        .catch(err => {
          console.log(err.message);
        });
      messageHandler.sendImageMessage(req, {
        message: { ...result.toObject(), uuid: req.body.uuid },
        receiver: JSON.parse(req.body.receiver)
      });
      res
        .status(200)
        .json({ message: { ...result.toObject(), uuid: req.body.uuid } });
    })
    .catch(err => {
      console.log(err.message);
      res.status(500).json({ message: err.message }); 
    });
};

exports.createFileMessage = (req, res) => {
  new Message({
    roomId: req.body.roomId,
    sender: req.userData.userId,
    receiver: JSON.parse(req.body.receiver)._id,
    file: req.body.document,
    messageType: "document"
  })
    .save()
    .then(result => {
      ChatRoom.findByIdAndUpdate(
        { _id: req.body.roomId },
        { $inc: { messages: 1 } }
      )
        .then(result => console.log(result))
        .catch(err => {
          console.log(err.message);
        });
      messageHandler.sendFileMessage(req, {
        message: { ...result.toObject(), uuid: req.body.uuid },
        receiver: JSON.parse(req.body.receiver)
      });
      res
        .status(200)
        .json({ message: { ...result.toObject(), uuid: req.body.uuid } });
    })
    .catch(err => {
      console.log(err.message);
      res.status(500).json({ message: err.message });
    });
};

exports.getChatRooms = (req, res) => {
  ChatRoom.getRooms(mongoose.Types.ObjectId(req.userData.userId))
    .then(rooms => {
      res.status(200).json({ rooms });
    })
    .catch(err => {
      console.log(err.message);
      res.status(500).json({ message: err.message });
    });
};

exports.getMessagesForRoom = (req, res) => {
  let query = null;
  if (req.body.initialFetch) {
    query = { roomId: req.body._id };
  } else {
    query = {
      $and: [
        {
          _id: {
            $lt: req.body.lastId
          },
          roomId: req.body._id
        }
      ]
    };
  }
  Message.find(query)
    .limit(50)
    .sort({ createdAt: -1 })
    .then(result => {
      res.status(200).json({ messages: result });
    })
    .catch(err => {
      console.log(err.message);
      res.status(500).json({ message: err.message });
    });
};

exports.sendMessage = (req, res) => {
  new Message({
    roomId: req.body.roomId,
    sender: req.userData.userId,
    text: req.body.value,
    receiver: req.body.receiver._id,
    messageType: "text"
  })
    .save()
    .then(result => {
      ChatRoom.findByIdAndUpdate(
        { _id: req.body.roomId },
        { $inc: { messages: 1 } }
      )
        .then(result => console.log(result))
        .catch(err => {
          console.log(err.message);
        });
      messageHandler.sendMessage(req, {
        message: { ...result.toObject() },
        receiver: req.body.receiver
      });
      res
        .status(200)
        .json({ message: { ...result.toObject(), uuid: req.body.uuid } });
    })
    .catch(err => {
      console.log(err.message);
      res.status(500).json({ message: err.message });
    });
};

exports.readMessages = (req, res) => {
  const receiverId = req.room.members.filter(
    member => member.toString().trim() !== req.userData.userId.toString().trim()
  );
  Message.updateMany(
    {
      _id: { $in: req.body.messageIds },
      receiver: mongoose.Types.ObjectId(req.userData.userId)
    },
    { $set: { read: true } },
    { multi: true }
  )
    .then(() => {
      messageHandler.sendReadMessage(req, {
        messageIds: req.body.messageIds,
        receiver: receiverId[0],
        roomId: req.room._id
      });
      res.status(200).json({ read: "messages" });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ msg: err.message });
    });
};

exports.handleCall = (req, res) => {
  User.findById(req.userData.userId)
    .select("profilePicture username")
    .then(user => {
      messageHandler.handleCall(req, {
        room: { ...req.body.currentRoom },
        webRtc: req.body.webRtc,
        caller: { ...user.toObject() }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ msg: err.message });
    });

  res.status(200).json({});
};

exports.answer = (req, res) => {
  const userId = req.room.members.filter(
    userId => userId.toString().trim() !== req.userData.userId.toString().trim()
  );
  messageHandler.handleAnswer(req, {
    userId,
    webRtc: req.body.webRtc
  });
  res.status(200).json({});
};



