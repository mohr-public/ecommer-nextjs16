import jwt from 'jsonwebtoken';


export const dynamic = "force-dynamic";


const AuthUser = async(req) => {

    const token = req.headers.get('Authorization')?.split(' ')[1];

    if (!token) {
        // return { success: false, message: "User is not authenticated." };
        return false;
    }
    console.log("Token from request headers:", token);
    try {
        const extractAuthUserInfo = jwt.verify(token, process.env.JWT_SECRET);
        if (extractAuthUserInfo) return extractAuthUserInfo;
    }
    catch (error) {
        console.error("JWT verification error:", error);
        // return { success: false, message: "Invalid token." };
        return false;
    }
};

export default AuthUser;