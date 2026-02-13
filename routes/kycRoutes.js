import express from "express";

import {
  verifyPAN,
  clientRedirationToDglockerForVeryfyClient,
  digilockerCallback
} from "../controllers/kycController.js";

const router = express.Router();
// Step 1 → KRA pan verification
router.post("/pan-verify", verifyPAN);
// Step 2 → Redirect to DigiLocker
router.get("/ekyc/digilocker/redirect", clientRedirationToDglockerForVeryfyClient);
// Step 3 → DigiLocker callback
router.get(
  "/ekyc/digilocker",
  digilockerCallback
);

export default router;
