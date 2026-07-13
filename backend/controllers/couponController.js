const Coupon = require("../models/Coupon");
const Booking = require("../models/Booking");

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
exports.getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });

    // Auto-update status for expired coupons before sending
    const now = new Date();
    let updated = false;
    for (let c of coupons) {
      if (c.status === "active" && new Date(c.expiry_date) < now) {
        c.status = "expired";
        await c.save();
        updated = true;
      }
    }

    res.status(200).json({
      success: true,
      count: coupons.length,
      data: coupons,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new coupon
// @route   POST /api/coupons
// @access  Private/Admin
exports.createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({
      success: true,
      data: coupon,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Coupon code already exists" });
    }
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update coupon
// @route   PUT /api/coupons/:id
// @access  Private/Admin
exports.updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }

    res.status(200).json({
      success: true,
      data: coupon,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Coupon code already exists" });
    }
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
exports.deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);

    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Validate coupon and check user booking usage limits
// @route   POST /api/coupons/validate
// @access  Private
exports.validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: "Coupon code is required." });
    }

    const coupon = await Coupon.findOne({ code: code.trim().toUpperCase() });
    if (!coupon) {
      return res.status(400).json({ success: false, message: "Invalid coupon code." });
    }

    if (coupon.status !== "active") {
      return res.status(400).json({ success: false, message: "This coupon is no longer active." });
    }

    const today = new Date();
    if (today < new Date(coupon.start_date)) {
      return res.status(400).json({ success: false, message: "Coupon is not active yet." });
    }

    if (today > new Date(coupon.expiry_date)) {
      return res.status(400).json({ success: false, message: "Coupon has expired." });
    }

    if (coupon.used_count >= coupon.total_uses) {
      return res.status(400).json({ success: false, message: "Coupon usage limit reached." });
    }

    const user_id = req.user.id;
    const userUsage = await Booking.countDocuments({
      user_id: Number(user_id),
      coupon_code: { $regex: new RegExp(`^${coupon.code}$`, "i") },
      status: { $ne: "cancelled" }
    });

    if (userUsage >= coupon.uses_per_user) {
      return res.status(400).json({
        success: false,
        message: `You can use this coupon only ${coupon.uses_per_user} time(s).`
      });
    }

    res.status(200).json({
      success: true,
      message: "Coupon applied successfully.",
      coupon
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
