const express = require("express");
const {
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../controllers/couponController");

// If you have auth middleware to protect these routes, import and use it.
// e.g., const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// Assuming admin routes might need auth in the future, we'll leave it standard for now.
// Add protect and authorize('admin') if needed.
router.route("/")
  .get(getCoupons)
  .post(createCoupon);

router.route("/:id")
  .put(updateCoupon)
  .delete(deleteCoupon);

module.exports = router;
