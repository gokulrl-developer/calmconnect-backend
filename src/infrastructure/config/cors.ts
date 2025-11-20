import cors, { CorsOptions } from "cors";

const corsOptions: CorsOptions = {
  origin: process.env.FRONTEND_BASE_URL,
  methods: ["GET", "POST", "PUT", "DELETE","PATCH","OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true 
};

export default corsOptions;