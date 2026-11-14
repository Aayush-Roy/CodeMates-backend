import { Router } from "express";
import RazorpayInstance from "../utils/razorpay.js";
import { userAuth } from "../middleware/adminAuth.js";
import { Payment } from "../models/payment.js";
import { membershipAmount } from "../utils/constant.js";
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils.js";
import { User } from "../models/user.js";

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


router.post("/payment/webhook",async(req,res)=>{
  try{
    const webhookSignature = req.headers('x-razorpay-signature');
   const isWebhookValid = validateWebhookSignature(JSON.stringify(req.body), webhookSignature, "codemates")
   if(!isWebhookValid) return res.json({msg:"Webhook signature is invalid"});
   const paymentDetails = req.body.payload.payment.entity;

   const payment = await Payment.findOne({orderId:paymentDetails.order_id})
    payment.status = paymentDetails.status;
    await payment.save();

    const user = await User.findOne({_id:payment.userId})
    user.isPremium = true;
    user.membershipType = payment.notes.membershipType;

    await user.save();

   if(req.body.event=='payment.captured'){

   }
   if(req.body.event=='payment.failed'){

   }


  }catch(err){
    console.log(err);
  }

})


router.get("/premium/verify",userAuth, async(req,res)=>{
  const user = req.user.toJSON();
  if(user.isPremium){
    return res.json({ ...user})
  }
  return res.json({...user})
})

export default router;