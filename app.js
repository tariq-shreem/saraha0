var cors = require('cors')
require('dotenv').config()
const express = require('express');
const { connectDB } = require('./DB/connection');
const app = express()
const PORT = process.env.PORT || 3000
app.use(cors())

const indexRouter = require('./modules/index.router');
app.use(express.json());
const baseUrl="/api/v1";
connectDB();
app.use(`${baseUrl}/upload`,express.static('./upload'));
app.use(`${baseUrl}/auth`,indexRouter.authRouter);
app.use(`${baseUrl}/message`,indexRouter.messageRouter);
app.use(`${baseUrl}/user`,indexRouter.userRouter);
app.use(`${baseUrl}/t`,(req,res)=>{
    res.json("tt");
})
app.get('*',(req,res)=>{
    res.json({message:"404 page not found"});
});


app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))