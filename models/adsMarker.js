const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Billboard = require("./Billboard");

const adsMarkerSchema = new Schema({
  address: {
    type: String,
    required: true,
  },
  ward: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  locationType: {
    type: String,
    enum: ["Đất công", "Đất tư nhân", "Trung tâm thương mại", "Chợ", "Cây xăng", "Nhà chờ xe buýt"],
    required: true,
  },
  adType: {
    type: String,
    enum: ["Cổ động chính trị", "Quảng cáo thương mại", "Xã hội hoá"],
    required: true,
  },
  // image: {
  //   type: Buffer, 
  //   required: true,
  // },
  planningStatus: {
    type: Boolean,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  billboards: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Billboard',
    required: false,
  },
  isActivated: {
    type: Boolean,
    required: true,
  }
});

module.exports = mongoose.model("adsMarker", adsMarkerSchema);