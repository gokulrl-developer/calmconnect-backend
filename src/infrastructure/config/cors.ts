import { CorsOptions } from "cors";

const allowedOrigins = process.env.FRONTEND_BASE_URL!.split(",");
const corsOptions: CorsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE","PATCH","OPTIONS"],
  credentials: true 
};

export default corsOptions;