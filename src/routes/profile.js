const express = require('express')
const router = express.Router()
const { userAuth} = require('../middlewares/auth')

router.get("/profile", userAuth, async (req,res) => {
    
    try {
        
        const user = req.user           
        console.log("this is the user==>",user);
        res.send(user)

    } catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }
})

module.exports = router;