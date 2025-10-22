import express from 'express';
import cookieParser from "cookie-parser";
import cors from "cors"
import userRoutes from './interfaces/routes/userRoutes';
import psychologistRoutes from './interfaces/routes/psychologistRoutes';
import adminRoutes from './interfaces/routes/adminRoutes';
import refreshRoute from './interfaces/routes/sharedRoutes'
import corsOptions from './infrastructure/config/cors';
import { errorHandler } from './utils/errorHandler';
import morgan from "morgan";

const app= express();
app.use(express.json());

app.use(cors(corsOptions));
app.use(cookieParser())
app.use(morgan("dev")); 

app.use("/", userRoutes);
app.use("/", psychologistRoutes);
app.use("/",adminRoutes);
app.use("/",refreshRoute);


app.use(errorHandler)

export default app;