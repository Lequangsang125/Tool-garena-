
import express from 'express';
import cors from 'cors'; 
import bodyParser from 'body-parser';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

//Router - Controller
import garenaAuthRouter from './src/router/garenaAuthRoutes.js';
import authRouter from './src/router/authRouter.js';
import walletRouter from './src/router/walletRouter.js';
import momoRoutes from './src/router/momoRouter.js';
import userRoutes from './src/router/userRouter.js';
import cookieParser from 'cookie-parser';
// import imageRoutes from './src/router/imageRoutes.js';



dotenv.config(); // Load biến môi trường từ file .env

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/Web-tool-garena';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Kết nối MongoDB thành công!'))
.catch((err) => console.error('❌ Lỗi kết nối MongoDB:', err));

const app = express();
const port = process.env.PORT || 4000;

// ✅ Cấu hình CORS
app.use(cors({
  origin: [
    'https://tool-garena-v1-lqs.onrender.com', // Cho phép truy cập từ frontend trên Render
    'http://localhost:3000' // Cho phép truy cập từ localhost:3000 trong môi trường phát triển
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Các phương thức được phép
  credentials: true, // Cho phép gửi cookie và headers
}));


app.use(bodyParser.json());
app.use(cookieParser());

//router
app.use("/api/users", userRoutes); // Sử dụng route User
app.use('/api/lienquan',garenaAuthRouter);
app.use("/api/auth", authRouter);
app.use("/api/wallet", walletRouter);
app.use("/api/momo", momoRoutes);
// app.use("/api/image", imageRoutes);

// cổng chạy
app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});