import express from 'express'
import { connectDb } from './db/connectDb.js';
import dotenv from 'dotenv'
import authRoutes from './routes/auth.route.js'
import carRoutes from './routes/car.route.js'
import buyRequestRoutes from './routes/buyRequest.route.js'
import cookieParser from 'cookie-parser';
import cors from 'cors'
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth',authRoutes);
app.use('/api/cars',carRoutes);
app.use('/api/buy-requests',buyRequestRoutes);

app.listen(PORT,()=>{
    connectDb();
    console.log("Server is running");
})