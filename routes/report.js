const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewave/auth");
const Report = require("../models/Report");
const User = require("../models/user")

router.post('/create', async (req, res) => {
    const {
        address,
        reportType,
        reporterName,
        reporterEmail,
        reporterPhone,
        reportContent
    } = req.body;

    try {
        const newReport = new Report({
            address,
            reportType,
            reporterName,
            reporterEmail,
            reporterPhone,
            reportContent
        });


        await newReport.save();

        return res.json({
            success: true,
            message: "Assign Successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

router.get('/info', verifyToken, async (req, res) => {
    try {
        const sys_ad = await User.findOne({ _id: req.userId });
        if (!sys_ad)
          return res.status(200).json({
            success: false,
            message: "Cán bộ văn hoá thể thao không tìm thấy",
          });

          if (sys_ad.role != "Cán bộ Sở")
          return res.status(200).json({
            success: false,
            message: "Access denied!",
          });
    
        const reports = await Report.find();
        if (reports.length === 0) {
          return res.json({ success: true, message: "There are no reports in report list" });
        }
        const allReports = reports.map(report => ({
            address: report.address,
            reportType: report.reportType,
            reporterName: report.reporterName,
            reporterEmail: report.reporterEmail,
            reporterPhone: report.reporterPhone,
            reportContent: report.reportContent
        }));
    
        return res.json({ success: true, reports: allReports });
      } catch (error) {
        console.log(error);
        return res.status(200).json({
          success: false,
          message: "Internal server error",
        });
      }
});

router.put("/update_report", verifyToken, async (req, res) => {
  console.log('gọi api thành công')
  try {
    const sys_ad = await User.findById(req.userId);

    if (!sys_ad || sys_ad.role !== "Cán bộ Sở") {
      return res.status(403).json({
        success: false,
        message: "Access denied!",
      });
    }

    const { address, reportType, reporterName, reporterEmail, reporterPhone, reportContent } = req.body;
    if (!address || !reportType || !reporterName || !reporterEmail || !reporterPhone || !reportContent) {
      return res.status(200).json({
        success: false,
        message: "Invalid or missing information!",
      });
    }

    const updatedReport = {
      address, reportType, reporterName, reporterEmail, reporterPhone, reportContent
    };

    const reportUpdatePrice = { address };
    const isUpdatedRp = await Report.findOneAndUpdate(
      reportUpdatePrice,
      updatedReport,
      { new: true }
    );

    if (!isUpdatedRp) {
      return res.status(200).json({
        success: false,
        message: "RP not found!",
      });
    }

    res.json({
      success: true,
      message: "Rp updated successfully",
      updatedReport,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

module.exports = router;