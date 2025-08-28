import dotenv from 'dotenv';
dotenv.config();

import app  from "./app";
import { connectDB } from "./infrastructure/config/mongoDB";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB(); 
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();




