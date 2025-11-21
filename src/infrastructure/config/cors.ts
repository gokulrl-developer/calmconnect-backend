import { CorsOptions } from "cors";

const allowedOrigins = process.env.FRONTEND_BASE_URL!.split(",");
const corsOptions: CorsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE","PATCH","OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true 
};

export default corsOptions;