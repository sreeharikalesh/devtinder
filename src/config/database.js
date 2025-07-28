const mongoose = require('mongoose');

const connectDB = async()=>{
    try {
        await mongoose.connect('mongodb+srv://sreehariaot:nvNHLH2aDjEYR1vj@cluster0.2j9c0vw.mongodb.net/devtinder')
    } catch (error) {
        console.error("mongo connection error==>",error);
    }
}

module.exports = connectDB