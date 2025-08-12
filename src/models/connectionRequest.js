const mongoose = require('mongoose');

const { Schema } = mongoose;

const connectionRequestSchema = new Schema({
    fromUserId:{
        type: mongoose.Types.ObjectId,
        required: true
    },
    toUserId:{
        type: mongoose.Types.ObjectId,
        required: true
    },
    status:{
        type: String,
        enum: {
            values: ['interested', 'ignored', 'accepted','rejected'],
            message: '{VALUE} is not supported'
        },
        required: true
    }
},{
    timestamps: true
})

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });


connectionRequestSchema.pre('save', async function (next) {
    const connectionRequest = this

    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("you cannot send connection request to yourself");
    }
})
const ConnectionRequestModel = mongoose.model('connectionRequest',connectionRequestSchema)

module.exports = ConnectionRequestModel