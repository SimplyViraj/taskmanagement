import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { testConnection } from "./config/dbconnection";
import taskRoutes from "./routes/taskRoutes";
import employeeRoutes from "./routes/employeeRoutes";
import authRoutes from "./routes/authRoutes";



dotenv.config();

const app = express();

app.use(cors({origin: "https://taskmanagement-sage-one.vercel.app", credentials: true})); 
app.use(express.json());
app.use("/api/tasks", taskRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/auth", authRoutes);

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Server running"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
