const express = require('express');
const app = express();

app.listen(3000,()=>{
    console.log('app is running on 3000')
});

app.use("/test",(req,res)=>{
    res.send({test:'data'},JSON);
})