import jwt from "jsonwebtoken"
import User from "../model/user.model.js"

const authenticate = async (req, res, next ) => {
    const token = req.cookies.jwt
   if(!token){
    return res.status(400).json({ message: "You are not authorized" })
   }
   try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
    req.user = await User.findById(decoded.userId)
    console.log(decoded);
    
   } catch (error) {
    return res.status(400).json({message:"" + error.message})
   }
    next()
}

export default authenticate