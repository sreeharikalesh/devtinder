const express = require('express')
const router = express.Router()
const { userAuth} = require('../middlewares/auth')
const { validateProfileEdit, validatePassword } = require('../utils/validations')
const bcrypt = require('bcrypt')

router.get("/profile/view", userAuth, async (req,res) => {
    
    try {
        const user = req.user           
        console.log("this is the user==>",user);
        res.send(user)

    } catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }
})

router.patch('/profile/edit',userAuth, async (req,res) => {
    try {
        
        if(!validateProfileEdit(req)){
            throw new Error("invalid edit request")
        }
        let loggedInUser = req.user;

        Object.keys(req.body).forEach(key=> loggedInUser[key] = req.body[key]);

        await loggedInUser.save()

        res.send("user updated successfully")
    } catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }   
})

router.patch('/profile/password/edit',userAuth, async(req, res)=>{
    try {
        const {currentPassword, newPassword} = req.body
        const user = req.user

        const isPasswordCorrect = await user.validatePassword(currentPassword)

        if(!isPasswordCorrect){
            throw new Error("password is not correct")
        }
        
        validatePassword(newPassword)

        const isSamePassword = await user.validatePassword(newPassword)

        if(isSamePassword){
            throw new Error("new password cannot be same as the old one")
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10)
        
        user.password = hashedNewPassword
        await user.save()

        res.send("password updated successfully")

    } catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }
})

module.exports = router;