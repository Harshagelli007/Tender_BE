const mongoose = require('mongoose');


const connectionRequest = new mongoose.Schema({
    formUserId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required : true,
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required : true
    },
    status: {
        type: String,
        enum:{
            values: ['accepted', 'rejected', 'intrested', 'ignored'],
            message: '{value} is not supported'
        }
    }
},{
    timestamps: true
});

connectionRequest.pre('save', async function(next){
    const userRequest = this;
    if(userRequest.formUserId.toString() === userRequest.toUserId.toString()){
        throw new Error('you cannot send connection request to yourSelf');
    }
    next();
})

const connectionRequestModel = mongoose.model('connectionRequests',connectionRequest);

module.exports = connectionRequestModel;