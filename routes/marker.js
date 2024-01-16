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

router.get('/info', async (req, res) => {
  try {
    const markers = await Marker.find().populate('billboards');
    const markerList = markers.map((marker) => ({
      address: marker.address,
      ward: marker.ward,
      district: marker.district,
      locationType: marker.locationType,
      adType: marker.adType,
      planningStatus: marker.planningStatus,
      latitude: marker.latitude,
      longitude: marker.longitude,
      billboards: marker.billboards,
    }));

    res.json({
      success: true,
      markerList: markerList,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
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
    const sys_ad = await User.findById(req.userId);

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
      console.log('có vô đây')
    var {ward: userWard} = extractAddressInfo(sys_ad.address);
    const markers = await Marker.find().populate('billboards');
    const markerList =  markers
    .filter(marker => {
      const { ward: markerWard } = extractAddressInfo(marker.address);
      return userWard === markerWard;
    }).map((marker) => ({
      address: marker.address,
      ward: marker.ward,
      district: marker.district,
      locationType: marker.locationType,
      adType: marker.adType,
      planningStatus: marker.planningStatus,
      latitude: marker.latitude,
      longitude: marker.longitude,
      billboards: marker.billboards,
    }));

    res.json({
      success: true,
      markerList: markerList,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});
module.exports = router;
