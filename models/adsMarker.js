const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adsMarkerSchema = new Schema({
  address: {
    type: String,
    required: true,
  },
  area: {
    ward: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
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
  image: {
    type: String, 
    required: true,
  },
  planningStatus: {
    type: Boolean,
    required: true,
  },
  latitude: {
    type: Int16Array,
    required: true,
  },
  longitude: {
    type: Int16Array,
    required: true,
  }
});

module.exports = mongoose.model("adsMarker", adsMarkerSchema);
