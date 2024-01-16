const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BillboardEditSchema = new Schema({
    address: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["Trụ bảng hiflex", "Trụ màn hình điện tử LED", "Trụ hộp đèn", "Bảng hiflex ốp tường", "Màn hình điện tử ốp tường", "Trụ treo băng rôn dọc", "Trụ treo băng rôn ngang", "Trụ/Cụm pano", "Cổng chào", "Trung tâm thương mại"],
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    date: {
      type: Date
    },
    editDate: {
        type: Date,
        required: true,
    },
    reason: {
        type:String,
        required: true
    }
  
  });
  
  module.exports = mongoose.model("BillboardEdit", BillboardEditSchema);
  