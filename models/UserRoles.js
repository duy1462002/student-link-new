const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const UserRolesSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  },
  roles: [
    {
      role: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "OrgRole"
      }
    }
  ]
});

module.exports = mongoose.model("UserRoles", UserRolesSchema);
