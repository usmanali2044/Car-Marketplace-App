import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateTokenandSetCookie } from "../utils/generateTokenandSetCookie.js";
import { sendResetPasswordEmail, sendResetSuccessEmail, sendVerificationEmail,sendWelcomeEmail } from "../mailtrap/emails.js";
import crypto from 'crypto'

export const signUp = async (req,res)=>{
    const {email,password,name} = req.body;
   try {
    if(!email || !password || !name){
        throw new Error('All fields are required');
    }

    const userAlreadyExist= await User.findOne({email});

    if(userAlreadyExist){
        return res.status(400).json({
            success:false,
            message:"user already exisits"
        })
    }

    const hashpassword = await bcrypt.hash(password,10);
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

    const user = new User({
        email,
        password:hashpassword,
        name,
        verificationToken,
        verificationTokenExpiresAt : Date.now() + 24 * 60 * 60 * 1000//24hours
    });

    await user.save();

    //jwt

    generateTokenandSetCookie(res,user._id);

    //mailtrap logic here
   await sendVerificationEmail(user.email,verificationToken);


   //if everthing goes right
    res.status(201).json({
        message:"User created Successfully",
        success:true,
        user :{
            ...user._doc,
            password:undefined
        }
    })

   } catch (error) {
    res.status(400).json({
        success:false,
        message:error.message
    })
   }
}

export const login = async (req,res)=>{
    const {email,password} = req.body;

    try {
        const user = await User.findOne({
        email : email,
        
    })

    if(!user){
        return res.status(400).json({
            success:false,
            message:"Invalid Credentials"
        })
    }
    
    const isPasswordValid = await bcrypt.compare(password,user.password);

    if(!isPasswordValid){
        return res.status(400).json({
            success:false,
            message:"Invalid Credentials"
        })
    }

    generateTokenandSetCookie(res,user._id);
    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
        success:true,
        message:"User Logged in Sucessfully",
        user:{
            ...user._doc,
            password:undefined
        }
    })
        
    } catch (error) {
        console.log("Error")
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
    
    


}


export const logout = async (req,res)=>{
    res.clearCookie("Token");
    res.status(200).json({
        success:true,
        message:"Logout Sucessfully"
    })
}


export const verifyEmail = async(req,res)=>{
    // for example user enter 6 digit number so it will be get from req.body

    const {code} = req.body;

    try {
        const user = await User.findOne({
            verificationToken:code,
            verificationTokenExpiresAt: {$gt:Date.now()}
        })   

        if(!user){
            return res.status(400).json({
                message:"Invalid or expired verification Code",
                success:false
            })
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        await sendWelcomeEmail(user.email,user.name);

        res.status(201).json({
            message:"Email Verified Successfully",
            success:true,
            user:{
                ...user._doc,
                password:undefined
            }
        })

        
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}

export const forgotPassword = async(req,res)=>{
    const {email} = req.body;
    try {
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                message:"Invalid Email",
                success:false
            })
        }

    const resetToken = crypto.randomBytes(20).toString("hex");
   const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour in future


    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;
    await user.save();


    await sendResetPasswordEmail(user.email,`${process.env.CLIENT_URL}/reset-password/${resetToken}`);
        
    res.status(200).json({
        success:true,
        message:"Password Reset Link is sent to your email"
    })
        
    } catch (error) {
        console.log("Error in forgotPassword",error);
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
}

export const resetPassword = async(req,res)=>{
    try {
        const {token} = req.params;
        const {password} = req.body;

        const user = await User.findOne({
            resetPasswordToken:token,
            resetPasswordExpiresAt:{ $gt:Date.now()}
        })

        if(!user){
            res.status(400).json({
                message:"Invalid or false Expired Reset Token",
                success:false
            })
        }

        const hashpassword = await bcrypt.hash(password,10);

        user.password = hashpassword;

        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined

        await user.save();

       await sendResetSuccessEmail(user.email)
       

       res.status(200).json({
        success:true,
        message:"Password Reset is Successfull"
       })

    } catch (error) {
        console.log("error in reset password",error);
        res.status(400).json({
            success:false,
            message:error.message,
            
        })
    }
}




export const checkAuth = async(req,res)=>{
    try {
        const user = await User.findById(req.userId);
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not found"
            })
        }

        res.status(200).json({
            success:true,
            user:{
                ...user._doc,
                password:undefined
            }
        });
    } catch (error) {
        console.log("Error in checkAuth",error);
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
}

