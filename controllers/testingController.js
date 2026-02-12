
import userModel from "../models/userModel.js"
import bcrypt from 'bcrypt'
const testingController = {
 demo:(req,res)=>{
    res.status(200).json({
        success:true,data:{
           protocal: req.protocol,
           host:req.host,
           url: `${req.protocol}://${req.host}`,
        }
    })
 },
 createUser : async (req, res) => {
  try {
    const {
      name,
      pan,
      dob,
      digilocker
    } = req.body;

    // basic validation
    if (!name || !pan || !dob) {
      return res.status(400).json({
        success: false,
        message: "name, pan and dob are required"
      });
    }

    const newUser = new userModel({
      name,
      pan,
      dob,
      digilocker: {
        verified: digilocker?.verified || false,
        aadhaarMasked: digilocker?.aadhaarMasked || null,
        transactionId: digilocker?.transactionId || null
      }
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: savedUser
    });

  } catch (error) {
    console.error("Create User Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
},
bcryptdemo:async(req,res)=>{
  try {
  let p=await bcrypt.hash("apple",10)
  console.log(p)
  
  res.status(200).json({success:true,message:"successfully done "})
  } catch (error) {
      res.status(200).json({success:false,message:error.message})
  }
},
bcryptdemocompare:async(req,res)=>{
  try {
  let p=await bcrypt.compare("apple",req.body.hash)
  console.log(p)

  res.status(200).json({success:true,message:"successfully done "})
  } catch (error) {
      res.status(200).json({success:false,message:error.message})
  }
},
jwt:(req,res)=>{
    res.status(200).json({
        success:true,
        message:"JWT demo endpoint - implement JWT logic here"
    })
}



}

export default testingController