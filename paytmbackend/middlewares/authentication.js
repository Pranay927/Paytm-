const jwt = require('jsonwebtoken');
const secret = "897n092q3ei[-53dy7bb8"


const auth =async (req, res, next) =>{
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(403).json({Error: "Unauthorized"});
    }

    const token = authorization.split(' ')[1];

    try{
        const decode = jwt.verify(token, secret);
        
        req.id = decode.id;
        console.log("reached")
        next();
        
    }
    catch(e){
        return res.status(403).json({Error: `Unauthorized` });
    }



}
module.exports = {auth};