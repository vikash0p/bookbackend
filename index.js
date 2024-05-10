import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import cors from 'cors'
import dbConnection from './utils/dbConnection.js';
import multer from 'multer';
import path from 'path';
import userRouter from './mvc/routes/userRoute.js';
import bookRouter from './mvc/routes/bookRoute.js';
import cookieParser from 'cookie-parser';
dotenv.config();
dbConnection();
const app = express()
const port = process.env.PORT

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true

}));
app.use(cookieParser())

app.use('/api/users', userRouter);
app.use('/api/books', bookRouter);

app.get('/', (req, res) => {
    res.send('Hello World!')
})



app.listen(port, () => {
    console.log(`e-commerce 2 server is running on http://localhost:${port}`)
})

