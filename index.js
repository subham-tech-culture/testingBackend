import express from "express";
import morgan from "morgan";
import colors from "colors"
import mongoose from "mongoose";
import cors from "cors"
import dotenv from "dotenv"
import kycRoutes from "./routes/kycRoutes.js";
import session from "express-session";
import testingRouter from "./routes/testingRouter.js"
import path from "path"
import authRoutes from "./routes/authRoutes.js"

dotenv.config()

const app=express()
const PORT=process.env.PORT ||8089
app.use(cors())
app.use(express.json())
app.use(morgan("dev"))

app.use(
  session({
    secret: "digilocker-secret",
    resave: false,
    saveUninitialized: true
  })
);

app.use("/file", express.static(path.join(process.cwd(), "files")));
// console.log(process)
app.use("/api/kyc", kycRoutes);
app.use("/api/test", testingRouter);
app.use("/api/auth", authRoutes);

mongoose.connect("mongodb://localhost:27017/project1").then(()=>{
    console.log(`db connected successfully`.bgCyan.white)
    app.listen(PORT,()=>console.log(`database is running on the port ${PORT}`.bgGreen.white))

}).catch((e)=>{
    console.log(`db not connected please check it`.bgRed.white)
})
