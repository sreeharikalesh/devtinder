const mongoose = require('mongoose');

const connectDB = async()=>{
    await mongoose.connect('mongodb+srv://sreehariaot:jxsu74jiDfmJkOoz@cluster0.2j9c0vw.mongodb.net/devtinder')
}

module.exports = connectDB