const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewave/auth");
const Marker = require("../models/adsMarker");
const Billboard = require("../models/Billboard")

router.post('/billboard', verifyToken, async (req, res) => {
    const {
        address,
        type,
        size,
        date
    } = req.body;

    try {


        const newBillboard = new Billboard({
            type,
            size,
            date
        });


        await newBillboard.save();

        const markerToUpdate = await Marker.findOne({ address });
        markerToUpdate.billboards = newBillboard._id; 
        await markerToUpdate.save();


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