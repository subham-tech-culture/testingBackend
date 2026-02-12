import axios from "axios";

export const verifyPAN = async (req, res) => {
  try {
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

    console.log("KRA Response:", kraResponse.data);

  return res.status(200).json({
      success: true,
      data: kraResponse.data,
    });

  } catch (error) {
    console.error("KRA Error:", error.response?.data || error.message);

    return res.status(500).json({
      success: false,
      message: "KRA Verification Failed",
    });
  }
};
