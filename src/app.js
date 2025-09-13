const express = require('express');
const app = express();
const db = require('./config/database');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth-routes');
const connectionRouter = require('./routes/connection-routes');
const profileRouter = require('./routes/profile-routes');
const connectionRoutes = require('./routes/connection-requests-routes');
const userRouter = require('./routes/user');
const cors = require('cors');

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true
}
db().then(()=>{
  console.log('DB connection extablished successfully');
  app.listen(3000,()=>{
    console.log('app is running on 3000')
  });
}).catch((error)=>{
  console.log(error)
})

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use('/', authRouter);
app.use('/', connectionRouter);
app.use('/',profileRouter);
app.use('/',connectionRoutes);
app.use('/',userRouter);

