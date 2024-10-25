import User from "../model/user.model.js"
import { z } from "zod"
import bcrypt from "bcrypt"
import generateTokenAndSaveINCookies from "../jwt/token.js"

// User schema validation using Zod
const userSchema = z.object({
    email: z.string().email({message: "invalid email address"}),
    username: z.string().min(3,{message: "Username atleast 3 character long"}).max(20),
    password: z.string().min(4,{message: "Password atlest 4 character long"}).max(20)
})

const register = async (req, res) => {
    try {
        const { email, username, password } = req.body
        const user = await User.findOne({ email })
        if(!email || !password || !username){
            return res.status(400).json({ message: "All fields are required" })
        }
        
        if (user) {
            return res.status(400).json({ message: "User already registered" })
        }

        const hashPassword = await bcrypt.hash(password,10)
        const validation = userSchema.safeParse({email, username, password})
        if (!validation.success) {
            const errorMessage = validation.error.errors.map(err => err.message)
            return res.status(400).json({ message: errorMessage});
        }
        const newUser = new User({ username, email, password:hashPassword })
        await newUser.save()

        // User registered successfully, send JWT token
        
        if (newUser) {
            const token = await generateTokenAndSaveINCookies(newUser._id, res)
            res.status(201).json({ message: "User registered Successfully", newUser , token})
        }
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: "Error in registering User" });
    }

}
const login = async (req, res) => {
    const {email, password} = req.body
    try{
        if(!email || !password){
            return res.status(400).json({ message: "All fields are required" })
        }
        const user = await User.findOne({ email }).select("+password")
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const token = await generateTokenAndSaveINCookies(user._id, res)
        res.status(201).json({ message: "User logged in successfully", user ,token} );
    }
    catch (error) {
        console.log(error)
        res.status(400).json({ message: "Error in logging in" });
    }

}
const logout = (req, res) => {
    try{
        res.clearCookie("jwt",{path:"/"});
        res.status(200).json({ message: "Logged out successfully" });
    }
    catch(error){
        console.log(error)
        res.status(500).json({ message: "Error in logging out" });
    }

}

export { register, login, logout }