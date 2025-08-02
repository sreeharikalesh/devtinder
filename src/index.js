const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require('./models/user')
const { validateSignupBody}= require('./../utils/validations')
const bcrypt = require("bcrypt")
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const {userAuth} = require('./middlewares/auth')



app.use(express.json())
app.use(cookieParser())

app.post('/signup',async(req,res)=>{ 

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

app.post('/login',async(req,res)=>{
    try {
        const {email, password} = req.body

        const user = await User.findOne({email: email})
         
        if(!user){
            throw new Error("invalid credentials")
        }

        const isUserAuthenticated = await bcrypt.compare(password, user.password);

        if(isUserAuthenticated){
            const token = jwt.sign({_id: user._id},"Sreehari@dev",{
                expiresIn: '1d'
            })
            res.cookie("token",token,{ expires: new Date(Date.now() + 10)})
            res.send("user authenticated successfully")
        }
        else{
            throw new Error("invalid credentials")
        }

    } catch (error) {
        res.status(400).send("authentication Error: "+ error.message)
    }
})

app.get("/profile", userAuth, async (req,res) => {
    
    try {
        
        const user = req.user           
        console.log("this is the user==>",user);
        res.send(user)

    } catch (error) {
         res.status(400).send("ERROR : " + error.message);
    }
})
app.get("/user",async (req,res)=>{
    let email = req.body.email
    try {
         let user = await User.find({email: email})

        if(user.length === 0){
            res.status(404).send("user not found")
        }
        else{
            res.send(user)

        }
    } catch (error) {
        res.status(400).send("something went wrong")
    }
})

app.get("/feed",async (req,res)=>{
    try {
         let user = await User.find({})

        if(user.length === 0){
            res.status(404).send("no users found")
        }
        else{
            res.send(user)

        }
    } catch (error) {
        res.status(400).send("something went wrong")
    }
})

app.delete("/deleteUser", async(req,res)=>{
    let userId = req.body.userId
    try {
        await User.findByIdAndDelete(userId)
        res.send("user deleted successfully")
    } catch (error) {
        res.status(400).send("something went wrong")
    }
})

app.patch("/updateUser/:userId", async(req,res)=>{
    let id = req.params.userId
    let data = req.body
    try {

        const ALLOWED_UPDATES = ["lastName","gender","password","gender","age","skills","photoUrl"]
        const isUpdatesAllowed = Object.keys(data).every(k=>{
            return ALLOWED_UPDATES.includes(k)
        })
        if(!isUpdatesAllowed){
            throw new Error('Field is not editable')
        }
        await User.findByIdAndUpdate(id , data, {runValidators: true})

        res.send("user updated successfully")
    } catch (error) {
        res.status(400).send("something went wrong: "+error.message)
    }
})
connectDB()
  .then(() => {
    console.log("database connected successfully");
    app.listen(3000, () => {
      console.log("listening to port 3000");
    });
  })
  .catch((err) => {
    console.log(err);
  });

