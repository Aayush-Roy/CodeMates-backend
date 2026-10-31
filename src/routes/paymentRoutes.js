import { Router } from "express";
import RazorpayInstance from "../utils/razorpay.js";
import { userAuth } from "../middleware/adminAuth.js";
import { Payment } from "../models/payment.js";
import { membershipAmount } from "../utils/constant.js";

const router = Router();

router.post("/payment/create", userAuth, async (req, res) => {
  try {
    const {membershipType} = req.body;
    console.log("mem type", membershipType)
    const {firstName, lastName, emailId} = req.user;
    console.log(firstName, lastName, emailId)
    console.log("amt be", membershipAmount[membershipType])
    const order = await RazorpayInstance.orders.create({
      amount: membershipAmount[membershipType]*100, // ₹500 in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes:{
        firstName,
        lastName,
        emailId,
        membershipType:membershipType,
      },
    });

    console.log("Order created:", order.id);

    const payment = new Payment({
      userId:req.user._id,
      orderId:order.id,
      status:order.status,
      amount:order.amount,
      fisrtName:firstName,
      lastName:lastName,
      emailId:emailId,
      currency:order.currency,
      reciept:order.receipt,
      notes:order.notes,
    })

    const savedPayment = await payment.save()
    res.status(201).json({ ...savedPayment.toJSON(), keyId:'rzp_test_TtOSqsXTsL5sd3' });
  } catch (err) {
    console.error("Payment creation error:", err);

    return res.status(500).json({
      message: "Failed to create Razorpay order",
      error: err.message,
    });
  }
});

export default router;