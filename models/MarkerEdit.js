const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const MarkerEditSchema = new Schema({
  address: {
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
  editDate: {
    type: Date,
    required: true
  },
  reason: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model("MarkerEdit", MarkerEditSchema);