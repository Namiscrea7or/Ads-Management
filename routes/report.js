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
    reportContent,
    reportProccessed
  } = req.body;

  try {
    const newReport = new Report({
      address,
      reportType,
      reporterName,
      reporterEmail,
      reporterPhone,
      reportContent,
      reportProccessed
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
      reportContent: report.reportContent,
      reportProccessed: report.reportProccessed,
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
  try {
    const sys_ad = await User.findById(req.userId);

    if (!sys_ad) {
      return res.status(403).json({
        success: false,
        message: "Access denied!",
      });
    }

    const { address, reportType, reporterName, reporterEmail, reporterPhone, reportContent, reportProccessed } = req.body;
    console.log('Thông tin: ', reporterName, reporterEmail, reportProccessed)
    if (!address || !reportType || !reporterName || !reporterEmail || !reporterPhone || !reportContent || !reportProccessed) {
      return res.status(200).json({
        success: false,
        message: "Invalid or missing information!",
      });
    }

    const updatedReport = {
      address, reportType, reporterName, reporterEmail, reporterPhone, reportContent, reportProccessed
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

router.delete("/:reportContent", verifyToken, async (req, res) => {
  try {
    const sys_ad = await User.findById(req.userId);

    if (!sys_ad) {
      return res.status(403).json({
        success: false,
        message: "Access denied!",
      });
    }

    const deleteRp = await Report.findOneAndDelete({
      reportContent: req.params.reportContent,
    });

    if (!deleteRp) {
      return res.status(200).json({
        success: false,
        message: "Report not found!",
      });
    }

    return res.json({
      success: true,
      message: "Report deleted successfully",
      deleteRp,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

function extractAddressInfo(address) {
  var parts = address.split(',');
  var ward = '';
  var district = '';

  for (var i = 0; i < parts.length; i++) {
    var part = parts[i].trim();

    if (part.includes('Ward') || part.includes('Phường')) {
      ward = part.replace(/(Ward|Phường)/i, '').trim();
    }

    if (part.includes('District') || part.includes('Quận')) {
      district = part.replace(/(District|Quận)/i, '').trim();
    }
  }

  return { ward, district };
}

router.get('/info_cbp', verifyToken, async (req, res) => {
  try {
    const sys_ad = await User.findOne({ _id: req.userId });
    if (!sys_ad)
      return res.status(200).json({
        success: false,
        message: "Khong tim thay can bo",
      });

    if (sys_ad.role != "Cán bộ Phường")
      return res.status(200).json({
        success: false,
        message: "Access denied!",
      });


    var {ward: userWard} = extractAddressInfo(sys_ad.address);
    const reports = await Report.find();
    if (reports.length === 0) {
      return res.json({ success: true, message: "There are no reports in report list" });
    }

    

    const matchingReports = reports
      .filter(report => {
        const { ward: reportWard } = extractAddressInfo(report.address);
        return userWard === reportWard;
      })
      .map(report => ({
        address: report.address,
        reportType: report.reportType,
        reporterName: report.reporterName,
        reporterEmail: report.reporterEmail,
        reporterPhone: report.reporterPhone,
        reportContent: report.reportContent,
        reportProccessed: report.reportProccessed
      }));

    return res.json({ success: true, reports: matchingReports });
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.get('/info_cbq', verifyToken, async (req, res) => {
  try {
    const sys_ad = await User.findOne({ _id: req.userId });
    if (!sys_ad)
      return res.status(200).json({
        success: false,
        message: "Khong tim thay can bo",
      });

    if (sys_ad.role != "Cán bộ Quận")
      return res.status(200).json({
        success: false,
        message: "Access denied!",
      });


    var {district: userDistrict} = extractAddressInfo(sys_ad.address);
    const reports = await Report.find();
    if (reports.length === 0) {
      return res.json({ success: true, message: "There are no reports in report list" });
    }

    

    const matchingReports = reports
      .filter(report => {
        const { district: reportDistrict } = extractAddressInfo(report.address);
        return userDistrict === reportDistrict;
      })
      .map(report => ({
        address: report.address,
        reportType: report.reportType,
        reporterName: report.reporterName,
        reporterEmail: report.reporterEmail,
        reporterPhone: report.reporterPhone,
        reportContent: report.reportContent,
        reportProccessed: report.reportProccessed,
      }));

    return res.json({ success: true, reports: matchingReports });
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      success: false,
      message: "Internal server error",
    });
  }
});

module.exports = router;

