const express = require('express');
const userRouter = express.Router();
const {isAutherized} = require('../middlewares/auth');
const connectionRequests = require('../modals/connectionRequests');

//get pending connection for logged user
userRouter.get('/requests/received',isAutherized, async(req,res)=>{
    try{
        const loggedUser = req.user;
        const pendingConnections = await connectionRequests.find({toUserId:loggedUser._id,status: 'intrested'}).populate('fromUserId',['firstName', 'lastName']);
        res.status(200).json(pendingConnections);
    }catch(err){
        res.send('Error: '+err.message);
    }
});

userRouter.get('/requests/acceptedConnections',isAutherized, async(req,res)=>{
    try{
        const loggedinUser = req.user;
        const acceptedConnections = await connectionRequests.find({$or:[{fromUserId:loggedinUser._id,status:'accepted'},{toUserId:loggedinUser._id,status:'accepted'}]}).populate('fromUserId',['firstName','lastName']);
        res.status(200).json(acceptedConnections);
    }catch(err){
        res.status(500).send('Error: '+err.message);
    }
});



module.exports = userRouter;