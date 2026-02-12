import express from "express";
import testingController from "../controllers/testingController.js";
const router=express.Router()

router.get("/demo",testingController.demo)
router.post("/user",testingController.createUser)
router.post("/bcrypt",testingController.bcryptdemo)
router.post("/bcryptdemocompare",testingController.bcryptdemocompare)
router.get("/jwt",testingController.jwt)



export default router
