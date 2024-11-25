const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const OrgRoleSchema = new mongoose.Schema({    
  code: {
    type: String,
    required: true,
    maxlength: 80,
    trim: true
  },
  members: [
    {
      user: { //the list of members
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "User"
      }
    }
  ],
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
  createdAt: {
    type: Date,
    default: Date.now
  }
});

OrgRoleSchema.index({ hashtag: "text", name: "text"});

module.exports = mongoose.model("OrgRole", OrgRoleSchema);
