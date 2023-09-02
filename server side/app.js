const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config({ path:'./config.env'})
const userRouter = require('./routers/user')
const postsRouter = require('./routers/posts')
const commentRouter = require('./routers/commentRouter')
const replyRouter = require('./routers/replyRouter')
const jwt = require('jsonwebtoken');
const { errorHandler } = require('./utils/errorHandler');
const rateLimit = require('express-rate-limit')
const helmet = require("helmet")
const cors = require('cors')
const cookieParser = require("cookie-parser")

const app = express();
app.use(helmet({crossOriginResourcePolicy: false}))
app.use(cookieParser())

mongoose.connect(process.env.MONGO_URI).then(()=>{
    const server = app.listen(process.env.PORT,()=>{
        console.log(`app is listening on port ${process.env.PORT}`);
        server.on("connection" , ()=> console.log("Some one connected haha"))
    });
})

// const server = app.listen(5000 , ()=> console.log("Server Is Listenning"))


const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, 
	max: 100000, 
})

app.use(limiter)
app.use(express.json({limit : '45kb'}))
app.use(express.urlencoded({extended : false}))
app.use(express.static("public"))
app.use(cors({origin : "http://localhost:3000"  , credentials : true}))
// app.use(function(req, res, next) {
//     // update to match the domain you will make the request from
//     res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
//     res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
//     res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
//     });



app.use('/api/v1/user',userRouter)
app.use('/api/v1/post',postsRouter)
app.use('/api/v1/post/:id/comment',commentRouter)
app.use('/api/v1/post/:id/comment/:commentId/reply',replyRouter)



app.use(errorHandler)

// Handler for 404 page

// app.all('*',(req ,res) => { 
//     res.sendStatus(404)
//  })

// Another handler for 404 page : that's another way instead of the previous way as i think in express 5 the "*" will be ".*"

app.use((req , res)=>{
    res.sendStatus(404)
})

