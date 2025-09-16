import express from 'express';

import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
import cookieParesr from 'cookie-parser'
import helmet from 'helmet'
import { connect } from 'http2'
import connectDB from './config/connectDB.js'

import userRoutes from './routes/userRoutes.js'
import problemRoutes from './routes/problemRoutes.js'
import creditRoute from './routes/creditRoute.js'
import mapapi from './routes/mapaip.js'

import morgan from 'morgan';
import fileUpload from 'express-fileupload';

const app = express()


app.use(cors())
app.options('*',cors())
app.use(express.json())
app.use(morgan())
app.use(helmet({
    crossOriginResourcePolicy : false
}))
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));


app.use('/api/users', userRoutes);
app.use('/api/users/problem', problemRoutes);
app.use('/api/users/credit', creditRoute);
app.use('/api/users/map', mapapi);

// app.get("/",(request,response)=>{
//     response.json({
//         message : "server is running vikram "+process.env.PORT
//     })
// })


connectDB().then(()=>{
    app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT} `));
})