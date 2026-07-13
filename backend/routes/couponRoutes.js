const express = require("express");
const {
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon
} = require("../controllers/couponController");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

// Public validation endpoint for users to apply coupon
router.post("/validate", verifyToken, validateCoupon);

router.route("/")
  .get(getCoupons)
  .post(createCoupon);

router.route("/:id")
  .put(updateCoupon)
  .delete(deleteCoupon);

module.exports = router;
