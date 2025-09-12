const jwt = require("jsonwebtoken");


exports.verifyToken = async (req,res,next) =>{
    const token =req.cookies?.token;
;
    if(!token){
        return res.status(401).json({message:"Access denied"});
    }
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);
        if(!decoded){
            return res.status(401).json({message:"Unauthorized"});
        }
        req.userId = decoded.userId;
        next();
    } catch (error) {
        
    }
}