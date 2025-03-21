
import express from 'express';
import cors from 'cors'; 
import bodyParser from 'body-parser';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import authRouter from './src/router/garenaAuthRoutes.js';

const app = express();
const port = process.env.PORT || 4000;

// ✅ Cấu hình CORS
app.use(cors({
  origin: 'http://localhost:3000', // Cho phép truy cập từ frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Các phương thức được phép
  credentials: true, // Cho phép gửi cookie và headers
}));

app.use(bodyParser.json());

app.use('/api/lienquan',garenaAuthRouter);
app.use("/api/auth", authRoutes);

app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});