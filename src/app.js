const express = require('express');
const app = express();
const db = require('./config/database');
const User = require('./modals/user');
const {validateSignUpData} = require('./utils/Valiation');
const bycrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const {isAutherized} = require('./middlewares/auth');

db().then(()=>{
  console.log('DB connection extablished successfully');
  app.listen(3000,()=>{
    console.log('app is running on 3000')
  });
}).catch((error)=>{
  console.log(error)
})

app.use(express.json());
app.use(cookieParser());


app.post('/signup',async (req,res)=>{
  try{
    validateSignUpData(req.body);
    const userExists = await User.findOne({emailId: req.body.emailId});
    if(userExists){
      throw new Error('User already Exists with this email ID')
    }
    const {firstName,lastName,emailId,password} = req.body;
    const encryptedPassword = await bycrypt.hash(password,10);
    const user = new User({firstName,lastName,emailId,password:encryptedPassword});
    await user.save();
    res.status(200).send(`Welcome ${req.body.firstName} ${req.body.lastName} you have been registerd succesfully`);
  }catch(err){
    res.status(400).send("Error: "+ err.message)
  }
});

app.post('/login',async (req,res)=>{

  try{
    const {emailId,password} = req.body;

    if(!emailId || !password){
      throw new Error('please provide required feilds');
    }
    const user = await User.findOne({emailId});
    console.log(user)
    if(!user){
      throw new Error('Invalid credentials');
    }
    if(user.decryptedPassword(password)){
      const token = await user.getJWT();
      res.cookie('token',token)
      res.status(200).send('user logged in succesfully');
    }else{
      throw new Error('Invalid credentials');
    }
    
  }catch(err){
    res.status(400).send(err.message);
  }
})

app.get('/getUser',isAutherized,(req,res)=>{
  console.log('working fine')
  res.send('Hi i am harsha')
});

app.get('/usersList',isAutherized,async (req,res)=>{
  try{
  //  const {token} = req.cookies;
  //  const decodedId = jwt.verify(token,'harshaGelli007');
  //     console.log(decodedId,'_id');
  //  const userId = User.findById(decodedId._id);
  //  console.log(userId);
  //  if(!userId){
  //   throw new Error('Login again to continue')
  //  }
    console.log(req.user);
   const data =  await User.find({});
   res.status(200).send(data);
  }catch(err){
    res.send(err);
  }
})

app.patch('/updateUser',isAutherized,async (req,res)=>{
  try{
    console.log(req.body.id,req.body)
    const data = await User.findByIdAndUpdate(req.body.id,req.body);
    console.log(data);
    res.status(200).send(data);
  }catch{

  }
})