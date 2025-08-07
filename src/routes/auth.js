const User = require('../models/user')
const bcrypt = require('bcrypt')
const {validateSignupBody} = require('../utils/validations')
const express = require('express')

const router = express.Router()

router.post('/signup',async(req,res)=>{ 

    try {
        validateSignupBody(req)

        const {email, password, firstName, lastName}= req.body

        const hashedPassword = await bcrypt.hash(password, 10)
        console.log(hashedPassword);

        const user = new User({
            email,
            password: hashedPassword,
            firstName,
            lastName
        })
        await user.save();
        res.send("user saved successfully")
    } catch (error) {
         if (error.code === 11000) {
            // Send a more specific, user-friendly error message
            res.status(409).send("A user with this email already exists.");
        } else {
            // Handle other validation errors (e.g., minLength, required)
            res.status(400).send("Error saving data to user: " + error.message);
        }
    }
    
    
})

router.post('/login',async(req,res)=>{
    try {
        const {email, password} = req.body

        const user = await User.findOne({email: email})
         
        if(!user){
            throw new Error("invalid credentials")
        }

        const isUserAuthenticated = user.validatePassword(password)

        if(isUserAuthenticated){
            const token = user.getJWT();
            res.cookie("token",token,{ maxAge: 24 * 60 * 60 * 1000, httpOnly: true})
            res.send("user authenticated successfully")
        }
        else{
            throw new Error("invalid credentials")
        }

    } catch (error) {
        res.status(400).send("authentication Error: "+ error.message)
    }
})

router.post('/logout',(req, res)=>{
    res.cookie("token", null,{
        expire: Date.now()
    })

    res.send("user logged out successfully")
})

module.exports = router;