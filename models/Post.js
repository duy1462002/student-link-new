const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    default: "",
    maxlength: 128
  },
  description: {
    type: String,
    trim: true,
    default: ""
  },
  photo: {
    type: String,
    trim: true
  },
  document: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: "You must supply an author"
  },
  group: {
    type: mongoose.Schema.ObjectId,
    ref: "Group"
  },
  hashtags: {
    type: Array,
    default: []
  },
  location: {
    type: {
      type: String
    },
    coordinates: { type: [], default: undefined },
    address: {
      type: String
    }
  },
  tags: {
    type: Array,
    default: []
  }
});

postSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Post", postSchema);
