const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
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
  address: {
    type: String,
    required: true,
  },
  birthday: {
    type: Date,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["Guest", "Staff", "Business_Admin", "System_Admin"],
  },
  money: {
    type: Number,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("users", UserSchema);