const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewave/auth");
const User = require("../models/user");

router.get('/info', verifyToken, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.userId });

        if (!user) {
            return res.status(200).json({
                success: false,
                message: 'User not found',
            });
        }

        return res.status(200).json({
            success: true,
            user: {
                email: user.email,
                full_name: user.full_name,
                phone_number: user.phone_number,
                dob: user.dob,
                role: user.role,
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});

router.get('/get_cbp_list', verifyToken, async (req, res) => {
    try {
        const user_find = await User.findOne({ _id: req.userId });

        if (user_find.role !== "Cán bộ Sở") {
            return res.status(200).json({
                success: false,
                message: 'Access denied',
            });
        }

        const user = await User.find({ role: "Cán bộ Phường" });
        if (!user) {
            return res.status(200).json({
                success: false,
                message: "No cbp!",
            });
        }

        const cbpList = user.map((user) => ({
            email: user.email,
            full_name: user.full_name,
            phone_number: user.phone_number,
            dob: user.dob
        }));

        return res.status(200).json({
            success: true,
            cbpList: cbpList
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});

router.get('/get_cbq_list', verifyToken, async (req, res) => {
    try {
        const user_find = await User.findOne({ _id: req.userId });

        if (user_find.role !== "Cán bộ Sở") {
            return res.status(200).json({
                success: false,
                message: 'Access denied',
            });
        }

        const user = await User.find({ role: "Cán bộ Quận" });
        if (!user) {
            return res.status(200).json({
                success: false,
                message: "No cbq!",
            });
        }

        const cbqList = user.map((user) => ({
            email: user.email,
            full_name: user.full_name,
            phone_number: user.phone_number,
            dob: user.dob
        }));

        return res.status(200).json({
            success: true,
            cbqList: cbqList
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});

router.get('/get_guest_list', verifyToken, async (req, res) => {
    try {
        const user_find = await User.findOne({ _id: req.userId });

        if (user_find.role !== "Cán bộ Sở") {
            return res.status(200).json({
                success: false,
                message: 'Access denied',
            });
        }

        const user = await User.find({ role: "Người Dân" });
        if (!user) {
            return res.status(200).json({
                success: false,
                message: "No Guests!",
            });
        }

        const guestList = user.map((user) => ({
            email: user.email,
            full_name: user.full_name,
            phone_number: user.phone_number,
            dob: user.dob
        }));

        return res.status(200).json({
            success: true,
            guestList: guestList
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
