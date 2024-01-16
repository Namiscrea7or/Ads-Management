const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewave/auth");
const BillboardEdit = require("../models/BillboardEdit");
const User = require("../models/user");

router.post('/billboard', verifyToken, async (req, res) => {
    const {
        address,
        type,
        size,
        date,
        editDate,
        reason
    } = req.body;

    try {
        const marker = await BillboardEdit.findOne({ address: address });

        if (marker) {
            return res.status(400).json({ success: false, message: "Already have this" });
        }

        const newMarker = new BillboardEdit({
            address,
            type,
            size,
            date,
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
        const markers = await BillboardEdit.find();
        const markerList = markers.map((marker) => ({
            address: marker.address,
            type: marker.type,
            size: marker.size,
            date: marker.date,
            editDate: marker.editDate,
            reason: marker.reason,
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

router.delete("/:address", verifyToken, async (req, res) => {
    try {
        const sys_ad = await User.findById(req.userId);

        if (!sys_ad || sys_ad.role !== "Cán bộ Sở") {
            return res.status(403).json({
                success: false,
                message: "Access denied!",
            });
        }
        const deleteUser = await BillboardEdit.findOneAndDelete({
            address: req.params.address,
        });
        console.log(deleteUser)

        if (!deleteUser) {
            return res.status(200).json({
                success: false,
                message: "BB not found!",
            });
        }

        return res.json({
            success: true,
            message: "BB deleted successfully",
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