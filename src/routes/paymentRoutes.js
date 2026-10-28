import { Router } from "express";
import RazorpayInstance from "../utils/razorpay.js";
import { userAuth } from "../middleware/adminAuth.js";

const router = Router();

router.post("/payment/create", userAuth, async (req, res) => {
  try {
    const order = await RazorpayInstance.orders.create({
      amount: 50000, // ₹500 in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    console.log("Order created:", order.id);

    return res.status(201).json({ order });
  } catch (err) {
    console.error("Payment creation error:", err);

    return res.status(500).json({
      message: "Failed to create Razorpay order",
      error: err.message,
    });
  }
});

export default router;