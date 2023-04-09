import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/config.js";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();

//Routes
import authMiddleWare from "./middleWare/AuthMiddleWare.js";
import AuthRouter from "./Router/AuthRouter.js";

//middlewear
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
dotenv.config();
connectDB();
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("connected");
});

app.use("/auth", AuthRouter);
