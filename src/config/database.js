const mongoose = require('mongoose');

const connectDB = async()=>{
    try {
        await mongoose.connect('REDACTED_MONGODB_URI')
    } catch (error) {
        console.error("mongo connection error==>",error);
    }
}

module.exports = connectDB