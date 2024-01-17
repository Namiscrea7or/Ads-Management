const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewave/auth");
const Marker = require("../models/adsMarker");
const User = require("../models/user");

router.post('/marker', verifyToken, async (req, res) => {
    const {
        address,
        locationType,
        adType,
        // image,
        planningStatus,
        latitude,
        longitude,
        isActivated
    } = req.body;
  
    try {
        const marker = await Marker.findOne({ address: address });

        if (marker) {
            return res.status(400).json({ success: false, message: "Already have this" });
        }

        const newMarker = new Marker({
            address,
            locationType,
            adType,
            // image,
            planningStatus,
            latitude,
            longitude,
            isActivated
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
      isActivated: marker.isActivated,
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
      isActivated: marker.isActivated,
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

router.get('/info_cbq', verifyToken, async (req, res) => {
  try {
    const sys_ad = await User.findById(req.userId);

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
    var {district: userWard} = extractAddressInfo(sys_ad.address);
    const markers = await Marker.find().populate('billboards');
    const markerList =  markers
    .filter(marker => {
      const { district: markerWard } = extractAddressInfo(marker.address);
      return userWard === markerWard;
    }).map((marker) => ({
      address: marker.address,
      ward: marker.ward,
      district: marker.district,
      locationType: marker.locationType,
      adType: marker.adType,
      planningStatus: marker.planningStatus,
      isActivated: marker.isActivated,
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

router.put("/update_marker", verifyToken, async (req, res) => {
  try {
    const sys_ad = await User.findById(req.userId);

    if (!sys_ad || sys_ad.role !== "Cán bộ Sở") {
      return res.status(403).json({
        success: false,
        message: "Access denied!",
      });
    }

    

    const { address, locationType, adType, planningStatus, isActivated } = req.body;
    console.log(address, locationType, adType, planningStatus, isActivated);
    // if (!address || !locationType || !adType || !planningStatus || !isActivated) {
    //   return res.status(200).json({
    //     success: false,
    //     message: "Invalid or missing information!",
    //   });
    // }

    const updatedUser = {
      address, locationType, adType, planningStatus, isActivated
    };


    const userUpdatePrice = { address };
    const isUpdatedUser = await Marker.findOneAndUpdate(
      userUpdatePrice,
      updatedUser,
      { new: true }
    );

    if (!isUpdatedUser) {
      return res.status(200).json({
        success: false,
        message: "Marker not found!",
      });
    }

    res.json({
      success: true,
      message: "Marker updated successfully",
      updatedUser,
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
