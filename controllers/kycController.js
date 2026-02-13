import axios from "axios";
import xml2js from "xml2js";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config()




export const clientRedirationToDglockerForVeryfyClient = async (req, res) => {
  try {
    const clientId = process.env.DG_CLIENT_ID;
    const redirectUri = "https://cms.ezwealth.in/api/ekyc/digilocker";

    const baseUrl =
      "https://digilocker.meripehchaan.gov.in/public/oauth2/1/authorize";

    // 1️⃣ Generate State
    const state = crypto.randomBytes(16).toString("hex");

    // 2️⃣ Generate PKCE Code Verifier
    const codeVerifier = crypto.randomBytes(32).toString("base64url");

    // 3️⃣ Generate Code Challenge (S256)
    const codeChallenge = crypto
      .createHash("sha256")
      .update(codeVerifier)
      .digest("base64url");

    // Store codeVerifier in session/db (VERY IMPORTANT)
    req.session.codeVerifier = codeVerifier;
    req.session.oauthState = state;

    const params = new URLSearchParams({
      response_type: "code",
      client_id: clientId,
      redirect_uri: redirectUri,
      state: state,
      scope: "address userdetails picture files.issueddocs",
      acr: "aadhaar+pan",
      amr: "aadhaar+pan",
      code_challenge: codeChallenge,
      code_challenge_method: "S256"
    });

    const authorizationUrl = `${baseUrl}?${params.toString()}`;

    console.log("Authorization URL:", authorizationUrl);

    res.redirect(authorizationUrl);

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};





export const digilockerCallback = async (req, res) => {
  try {
    const { code, state } = req.query;

    if (!code) {
      return res.status(400).json({ message: "Authorization code missing" });
    }

    // 1️⃣ Validate State (VERY IMPORTANT)
    if (state !== req.session.oauthState) {
      return res.status(400).json({ message: "Invalid state" });
    }

    const codeVerifier = req.session.codeVerifier;

    if (!codeVerifier) {
      return res.status(400).json({ message: "Code verifier missing" });
    }

    // 2️⃣ Exchange Code for Token (PKCE flow)
    const tokenResponse = await axios.post(
      "https://digilocker.meripehchaan.gov.in/public/oauth2/1/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: "https://cms.ezwealth.in/api/ekyc/digilocker",
        client_id: process.env.DG_CLIENT_ID,
        code_verifier: codeVerifier
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );

    const { access_token, id_token } = tokenResponse.data;

    // 3️⃣ Decode ID Token
    const payload = JSON.parse(
      Buffer.from(id_token.split(".")[1], "base64").toString()
    );

    console.log("User Details:", payload);

    // Example fields
    console.log("PAN:", payload.pan);
    console.log("Name:", payload.name);
    console.log("DOB:", payload.birthdate);

    // TODO: Save to DB

    res.json({
      success: true,
      message: "Client verified successfully",
      data: payload
    });

  } catch (error) {
    console.error("Digilocker Error:", error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message: error.response?.data || "Verification failed"
    });
  }
};


export const verifyPAN = async (req, res) => {
  try {
    let kraStatus = [
      { "code": "002", "meaning": "KYC Registered" },
      { "code": "007", "meaning": "KYC Registered & Valid" },
      { "code": "011", "meaning": "KYC On Hold" },
      { "code": "014", "meaning": "KYC Rejected" }
    ]

    const { pan, dob } = req.body;

    // 1️⃣ Check existing client first
    const existingResponse = await axios.post(
      "https://cms.ezwealth.in/api/existing-client/check",
      { panNo: pan },
      { headers: { "Content-Type": "application/json" } }
    );

    // if (existingResponse.data.exists) {
    //   return res.status(200).json({
    //     success: false,
    //     message: "User already exists. Send to dashboard or login.",
    //   });
    // }

    // 2️⃣ Call CDSL KRA API
    const kraResponse = await axios.get(
      "https://www.cvlkra.com/paninquiry.asmx/GetPanStatus",
      // "https://PANCheck.www.kracvl.com",
      {
        params: {
          panNo: pan,
          username: process.env.CVLKRA_USERNAME,
          PosCode: process.env.CVLKRA_POSCODE,
          Password: process.env.CVLKRA_PASSWORD,
          PassKey: process.env.CVLKRA_PASSKEY,
        },
      }
    );
    const parsed = await xml2js.parseStringPromise(kraResponse.data, {
      explicitArray: false,
    });

    const panData = parsed.APP_RES_ROOT.APP_PAN_INQ;

    return res.status(200).json({
      success: true,
      pan: panData.APP_PAN_NO,
      name: panData.APP_NAME,
      status: panData.APP_STATUS,
      kycMode: panData.APP_KYC_MODE,
      ipv: panData.APP_IPV_FLAG,
      statusName: kraStatus.find(data => data.code == panData.APP_STATUS).meaning
    });
    // return res.status(200).json(kraResponse.data);



  } catch (error) {
    console.error("KRA Error:", error.response?.data || error.message);

    return res.status(500).json({
      success: false,
      message: "KRA Verification Failed",
    });
  }
};