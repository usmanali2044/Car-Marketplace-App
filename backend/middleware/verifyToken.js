import jwt, { decode } from 'jsonwebtoken'

export const verifyToken = (req,res,next)=>{
 const token = req.cookies.Token;
    if(!token){
        return res.status(400).json({
            success:false,
            message:"Unauthorized"
        })
    }
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded){
            return res.status(400).json({
                message:"Unauthorized Invalid Token",
                message:"Success"
            })
        }

        req.userId = decoded.userId
        next();
        
    } catch (error) {
        console.log("Error verify Token",error);
        return res.status(500).json({
            success:false,
            message:"Server error"
        })
    }
}