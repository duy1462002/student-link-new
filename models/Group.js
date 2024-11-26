const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const GroupSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  },
  members: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "User"
      }
    }
  ],
  admins: [
    {
      userId: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "User"
      }
    }
  ],
  posts: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "Post"
      }
    }
  ],
  coverImage: {
    type: String,
    maxlength: 300,
    trim: true,
    default: "cover-page.png"
  },
  hashtag: {
    type: String,
    required: true,
    maxlength: 20,
    trim: true
  },
  name: {
    type: String,
    required: true,
    maxlength: 128,
    trim: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 250,
    trim: true
  },
  rules: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

GroupSchema.index({ hashtag: "text", name: "text" });

module.exports = mongoose.model("Group", GroupSchema);
