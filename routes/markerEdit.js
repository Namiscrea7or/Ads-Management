const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewave/auth");
const MarkerEdit = require("../models/MarkerEdit");
const User = require("../models/user");

router.post('/marker', verifyToken, async (req, res) => {
    const {
        address,
        locationType,
        adType,
        // image,
        planningStatus,
        editDate,
        reason
    } = req.body;

    try {
        const marker = await MarkerEdit.findOne({ address: address });

        if (marker) {
            return res.status(400).json({ success: false, message: "Already have this" });
        }

        const newMarker = new MarkerEdit ({
            address,
            locationType,
            adType,
            // image,
            planningStatus,
            editDate,
            reason
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
    const sys_ad = await User.findById(req.userId);

    if (!sys_ad)
      return res.status(200).json({
        success: false,
        message: "Khong tim thay can bo",
      });

    if (sys_ad.role != "Cán bộ Sở")
      return res.status(200).json({
        success: false,
        message: "Access denied!",
      });
      const markers = await MarkerEdit .find();
      const markerList = markers.map((marker) => ({
        address: marker.address,
        locationType: marker.locationType,
        adType: marker.adType,
        planningStatus: marker.planningStatus,
        editDate: marker.editDate,
        reason: marker.reason,
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

  router.delete("/:address", verifyToken, async (req, res) => {
    try {
      const sys_ad = await User.findById(req.userId);
  
      if (!sys_ad || sys_ad.role !== "Cán bộ Sở") {
        return res.status(403).json({
          success: false,
          message: "Access denied!",
        });
      }
      const deleteUser = await MarkerEdit.findOneAndDelete({
        address: req.params.address,
      });
      console.log(deleteUser)
  
      if (!deleteUser) {
        return res.status(200).json({
          success: false,
          message: "Marker not found!",
        });
      }
  
      return res.json({
        success: true,
        message: "Marker deleted successfully",
        deleteUser,
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