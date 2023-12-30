const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReportSchema = new Schema({
  address: {
    type: String,
    required: true
  },
  reportType: {
    type: String,
    enum: ['Tố giác sai phạm', 'Đăng ký nội dung', 'Đóng góp ý kiến', 'Giải đáp thắc mắc'],
    required: true,
  },
  reporterName: {
    type: String,
    required: true,
  },
  reporterEmail: {
    type: String,
    required: true,
  },
  reporterPhone: {
    type: String,
    required: true,
  },
  reportContent: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("report", ReportSchema);