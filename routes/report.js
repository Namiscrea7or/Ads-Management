const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewave/auth");
const Report = require("../models/Report");

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
module.exports = router;