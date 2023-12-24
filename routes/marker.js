const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewave/auth");
const Marker = require("../models/adsMarker");

router.post('/marker', verifyToken, async (req, res) => {
    const {
        address,
        ward,
        district,
        locationType,
        adType,
        // image,
        planningStatus,
        latitude,
        longitude
    } = req.body;
  
    try {
        const marker = await Marker.findOne({ address: address });

        if (marker) {
            return res.status(400).json({ success: false, message: "Already have this" });
        }

        const newMarker = new Marker({
            address,
            ward,
            district,
            locationType,
            adType,
            // image,
            planningStatus,
            latitude,
            longitude,
        });
        
       
        await newMarker.save();

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
        const markers = await Marker.find();
        const markerList = markers.map((marker) => ({
            address: marker.address,
            ward: marker.ward,
            district: marker.district,
            locationType: marker.locationType,
            adType: marker.adType,
            // image,
            planningStatus: marker.planningStatus,
            latitude: marker.latitude,
            longitude: marker.longitude,
            billboards: marker.billboards
        }))
        res.json({
            success:true,
            markerList: markerList
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});


module.exports = router;
