const express = require('express');
const connectionRouter = express.Router();

connectionRouter.post('/sendConnectionRequest',async(req,res)=>{
  try{
    res.send('connection request sent');
  }catch(err){
    res.send(err.message);
  }
});



module.exports = connectionRouter;