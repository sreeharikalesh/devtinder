const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require('./models/user')


app.use(express.json())

app.post('/signup',async(req,res)=>{
    const user = new User(req.body)

    try {
        await user.save();
        res.send("user saved successfully")
    } catch (error) {
        res.status(400).send("error saving data to user:"+ error.message)
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

