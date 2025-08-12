const express = require('express');
const router = express.Router();
const { userAuth} = require('../middlewares/auth')
const connectionRequestModel = require('../models/connectionRequest');
const UserModel = require("../models/user")

router.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {

    const fromUserId = req.user._id
    const toUserId = req.params.toUserId
    const status = req.params.status

    const allowedStatus = ["interested","ignored"]

    if(!allowedStatus.includes(status)){
      throw new Error("invalid status type");
    }

    const toUser = await UserModel.findById({_id : toUserId});

    if(!toUser){
      throw new Error("user not found");
    }

    const existingConnectionRequest = connectionRequestModel.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ]
    })
    
    if(existingConnectionRequest){
      throw new Error("connection request already exists");
      
    }
    
    const connectionRequest = new connectionRequestModel({
      fromUserId,
      toUserId,
      status
    })

    const data = await connectionRequest.save();

    res.status(200).json({
      message: "connection request sent successfully",
      data : data
    })
  } catch (error) {
    res.status(400).send("ERROR: "+ error.message)
  }
});

module.exports = router;
