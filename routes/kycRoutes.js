import express from "express";

import {
  verifyPAN,
} from "../controllers/kycController.js";

const router = express.Router();

router.post("/pan-verify", verifyPAN);


export default router;

//http://localhost:8089/api/kyc/digilocker/login
//http://localhost:8089/api/kyc/pan-verify
//http://localhost:8089/api/kyc/digilocker/callback
