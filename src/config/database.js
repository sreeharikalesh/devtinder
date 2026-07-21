const mongoose = require('mongoose');

const connectDB = async()=>{
    await mongoose.connect('REDACTED_MONGODB_URI')
}

module.exports = connectDB