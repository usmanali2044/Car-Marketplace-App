import jwt from 'jsonwebtoken'

export const generateTokenandSetCookie = async (res,userId)=>{
    const token = jwt.sign(
        {userId},
        process.env.JWT_SECRET,
        {expiresIn:"7d"}
    )

    res.cookie(
        "Token",
        token,
        {
            httpOnly: true, // prevent XSS attack
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7*24*60*60*1000

        }
    );

    return token
}