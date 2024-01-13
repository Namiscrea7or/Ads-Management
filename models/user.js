const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  full_name: {
    type: String,
    required: true,
  },
  phone_number: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  role: {
    type: String,
    enum: ["Người Dân", "Cán bộ Phường", "Cán bộ Quận", "Cán bộ Sở"],
  },
});

module.exports = mongoose.model("users", UserSchema);