const express = require('express');
const connectionRoutes = express.Router();
const {isAutherized} = require('../middlewares/auth');
const connectionRequest = require('../modals/connectionRequests');
const userDb = require('../modals/user');


connectionRoutes.post('/feedRequests/:status/:toUserId',isAutherized,async (req,res)=>{
  try{
    const formUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    const validStatuses = {'intrested':true,'ignored': true};
    if(!validStatuses[status]){
        throw new Error('invalid status provided');
    } 

    const isRequestValid = await connectionRequest.findOne({$or:[{formUserId,toUserId},{formUserId:toUserId,toUserId:formUserId}]});
    if(isRequestValid){
        throw new Error('you already sent a request to this user');
    }
    const connectionRequestModal = new connectionRequest({
        formUserId,
        toUserId,
        status
    });
    await connectionRequestModal.save();
    res.status(200).send('connection request sent successfully');
  }catch(err){
    res.status(400).send('Error: '+err.message);
  }
});

connectionRoutes.post('/requests/received/:status/:toUserId',isAutherized,async (req,res)=>{
    try{
        const validStatuses = {accepted:true,rejected:true}
        if(!validStatuses[req.params.status]){
            throw new Error('Invalid status provided');
        }
        const userRequest = await connectionRequest.findOne({formUserId:req.params.toUserId,toUserId:req.user._id,status:'intrested'});
        if(!userRequest){
            throw new Error('Inavalid request');
        }
        userRequest.status = req.params.status;
        await userRequest.save();
        res.status(200).json({message:'Request sent successfully'});
    }catch(err){
        res.status(400).send('Error: '+err.message);
    }
});

connectionRoutes.get('/profiles/feed',isAutherized,async (req,res)=>{
    try{
        const userdId = req.user._id;
        const page = parseInt(req.query.page) || 1;
        const length = parseInt(req.params.length) || 10;
        const dataToFilter = await connectionRequest.find({$or:[{formUserId:req.user._id},{toUserId:req.user._id}]}).select('formUserId toUserId');
        const dataSetToFilter = new Set();
        dataToFilter.forEach(item =>{
            if(item.toUserId && item.toUserId.toString() !== userdId.toString()){
                dataSetToFilter.add(item.toUserId.toString());
            }
            if(item.formUserId && item.formUserId.toString() !== userdId.toString()){
                dataSetToFilter.add(item.formUserId.toString());
            }
        });
        console.log(dataToFilter,'data filtered')
        const dataToSend = await userDb.find({
  $and: [
    { _id: { $nin: Array.from(dataSetToFilter) } },
    { _id: { $ne: req.user._id } }
  ]
}).select('firstName lastName photoUrl age');;
        res.status(200).json({data:dataToSend,message:'Data fetched succesfully'});
    }catch(err){
        res.status(400).json({message:'Error: '+err.message});
    }
});

connectionRoutes.get('/allConnections',isAutherized, async (req,res)=>{
    try{
        // const requests = await connectionRequest.find({$or:[{formUserId:req.user._id},{toUserId:req.user._id},{status:'intrested'},{status:'accepted'},{status:'rejected'}]}).populate('firstName lastName _id');
        const requests = await connectionRequest.find({$and:[
            {$or:[{formUserId:req.user._id},{toUserId:req.user._id}]},
        {status:{$in:['intrested','accepted','rejected']}}
    ]}).select('fromUserId toUserId status createdAt')
    .populate('formUserId','firstName lastName _id')
    .populate('toUserId','firstName lastName _id');
        res.status(200).send(requests);
    }catch(err){
        res.status(400).send('something went wrong')
    }
});


connectionRoutes.get('/myConnections', isAutherized, async (req, res) => {
  try {
    const requests = await connectionRequest
      .find({
        $and: [
          { $or: [{ formUserId: req.user._id }, { toUserId: req.user._id }] },
          { status: { $in: ['accepted'] } }
        ]
      })
      .select('formUserId toUserId status createdAt')
      .populate('formUserId')
      .populate('toUserId');

    // Filter and map to only include the other user
    const filtered = requests.map((conn) => {
      const isFormUser = conn.formUserId._id.toString() === req.user._id.toString();

      return {
        _id: conn._id,
        status: conn.status,
        createdAt: conn.createdAt,
        user: isFormUser ? conn.toUserId : conn.formUserId,
      };
    });

    res.status(200).send(filtered);
  } catch (err) {
    console.error(err);
    res.status(400).send('Something went wrong');
  }
});

connectionRoutes.get('/newConnections',isAutherized, async (req,res)=>{
    try{
        // const requests = await connectionRequest.find({$or:[{formUserId:req.user._id},{toUserId:req.user._id},{status:'intrested'},{status:'accepted'},{status:'rejected'}]}).populate('firstName lastName _id');
       const requests = await connectionRequest.find({toUserId:req.user._id,status:'intrested'}).populate('formUserId');
        res.status(200).send(requests);
    }catch(err){
        res.status(400).send('something went wrong')
    }
});






module.exports = connectionRoutes;