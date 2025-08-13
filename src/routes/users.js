const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");

const router = express.Router();

router.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "skills",
      "photo",
      "about",
    ]);

    res.status(200).json(connectionRequests);

  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

router.get('/user/connections',userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connections = await ConnectionRequestModel.find({
            $or:[
                {toUserId: loggedInUser._id, status: "accepted"},
                {fromUserId: loggedInUser._id , status: "accepted"}
            ]
        }).populate("fromUserId", [
            "firstName",
            "lastName",
            "skills",
            "photo",
            "about",
        ]).populate("toUserId", [
            "firstName",
            "lastName",
            "skills",
            "photo",
            "about",
        ])

        const data = connections.map((connection)=>{
            if(connection.fromUserId._id.toString() === loggedInUser._id.toString()){
                return connection.toUserId
            }
            return connection.fromUserId
        })
        res.json(data)
    } catch (error) {
        res.status(400).send("ERROR: "+ error.message)
    }
})

module.exports = router;
