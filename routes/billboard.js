const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewave/auth");
const Marker = require("../models/adsMarker");
const Billboard = require("../models/Billboard")
const User = require("../models/user");

router.post('/billboard', verifyToken, async (req, res) => {
    const {
        address,
        type,
        size,
        date,
        isActivated
    } = req.body;

    try {
        const newBillboard = new Billboard({
            address,
            type,
            size,
            date,
            isActivated
        });
        await newBillboard.save();
        const markerToUpdate = await Marker.findOne({ address:address });
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

router.get('/info', async (req, res) => {
  try {
    const markers = await Billboard.find();
    const markerList =  markers.map((marker) => ({
      address: marker.address,
      type: marker.type,
      size: marker.size,
      date: marker.date,
      isActivated: marker.isActivated
    }));

    res.json({
      success: true,
      bbList: markerList,
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
      const markers = await Billboard.find();
      const markerList =  markers
      .filter(marker => {
        const { ward: markerWard } = extractAddressInfo(marker.address);
        return userWard === markerWard;
      }).map((marker) => ({
        address: marker.address,
        type: marker.type,
        size: marker.size,
        date: marker.date,
        isActivated: marker.isActivated
      }));
  
      res.json({
        success: true,
        bbList: markerList,
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
      const markers = await Billboard.find();
      const markerList =  markers
      .filter(marker => {
        const { district: markerWard } = extractAddressInfo(marker.address);
        return userWard === markerWard;
      }).map((marker) => ({
        address: marker.address,
        type: marker.type,
        size: marker.size,
        date: marker.date,
        isActivated: marker.isActivated
      }));
  
      res.json({
        success: true,
        bbList: markerList,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  });

  router.put("/update_billboard", verifyToken, async (req, res) => {
    try {
      const sys_ad = await User.findById(req.userId);
  
      if (!sys_ad || sys_ad.role !== "Cán bộ Sở") {
        return res.status(403).json({
          success: false,
          message: "Access denied!",
        });
      }
  
      const { address, type, size, date, isActivated } = req.body;
      // if (!address || !type || !size || !date || !isActivated) {
      //   return res.status(200).json({
      //     success: false,
      //     message: "Invalid or missing information!",
      //   });
      // }
  
      const updatedUser = {
        address, type, size, date, isActivated
      };
  
      const userUpdatePrice = { address };
      const isUpdatedUser = await Billboard.findOneAndUpdate(
        userUpdatePrice,
        updatedUser,
        { new: true }
      );
  
      if (!isUpdatedUser) {
        return res.status(200).json({
          success: false,
          message: "BB not found!",
        });
      }
  
      res.json({
        success: true,
        message: "BB updated successfully",
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