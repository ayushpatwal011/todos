import jwt from "jsonwebtoken"
import User from "../model/user.model.js"

const generateTokenAndSaveINCookies = async (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, { expiresIn: '10d' });
    res.cookie("jwt", token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: "/"
    });
    await User.findByIdAndUpdate(userId,(token))
    return token
}

export default generateTokenAndSaveINCookies

// xIHyulZMj8zkVb/OqPTnB/vH5EON1Bx0OE/lLMLa0UY=