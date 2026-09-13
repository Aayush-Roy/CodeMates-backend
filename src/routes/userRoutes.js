import { Router } from "express";
import { userAuth } from "../middleware/adminAuth.js";
import { Connection } from "../models/connectionRequest.js";
const router = Router();

const USER_SAFE_DATA = "firstName lastName age photoUrl gender skills about";
router.get("/user/requests/recieved", userAuth, async (req,res)=>{
    try{
        const loggedInUser = req.user;
        const connectionRequests = await Connection.find({
            toUserId:loggedInUser._id,
            status:"interested"  
        }).populate("fromUserId",USER_SAFE_DATA);
        return res.json({
            message:"Data fetch Successfully",
            data:connectionRequests
        })
    }catch(err){
        res.status(400).send({message:"Error " + err.message})
    }
})


// router.get("/user/connections", userAuth, async(req,res)=>{
//     try{
//         const loggedInUser = req.user;
//         const connectionReqeuests = await Connection.find({
//             $or:[
//                 {
//                     toUserId:loggedInUser._id, status:"accepted",
//                 },
//                 {fromUserId:loggedInUser._id, status:"accepted"}
//             ]
//         }).populate("fromUserId",USER_SAFE_DATA)
//         .populate("toUserId", USER_SAFE_DATA)

//         connectionReqeuests.forEach((row) => {
//     console.log("FROM:", row.fromUserId);
//     console.log("TO:", row.toUserId);
//     console.log("STATUS:", row.status);
// });
//         const data = connectionReqeuests.map((row)=>row.fromUserId);
//         return res.json(data);
//     }catch(err){
//         res.status(400).json(err.message )
//     }
// })
router.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await Connection.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    console.log(connectionRequests);

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({ data });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});


export default router;