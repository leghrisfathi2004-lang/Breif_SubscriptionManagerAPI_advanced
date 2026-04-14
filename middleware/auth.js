const jwt = require('jsonwebtoken');
const {respond} = require('./respond.js');

const authUser = (req, res, next) => {    
    try{
        const head = req.headers.authorization;
        if(!head || !head.startsWith("Bearer"))
            return respond(res, 401, "register first!");
        const tokenvalue = head.split(" ")[1];
        const decode = jwt.verify(tokenvalue, process.env.jwt_code);
        //decode = {id: ****, name: ****, email: *****, expiresIn...}
        req.user = decode;
        next();
    } catch(e) {
        console.log("JWT error:", e.message);
        return res.status(401).json({errour: e.message});
    }
}

const authAdmin = (req, res, next) => {    
    try{
        const head = req.headers.authorization;
        if(!head || !head.startsWith("Bearer"))
            return respond(res, 401, "register first!");
        const tokenvalue = head.split(" ")[1];
        const decode = jwt.verify(tokenvalue, process.env.jwt_code);
        console.log(decode);
        if(decode.role !== "admin")
            return respond(res, 401, "only admins");
        req.user = decode;
        next();
    } catch(e) {
        console.log("JWT error:", e.message);
        return res.status(401).json({errour: e.message});
    }
}


module.exports = {authUser, authAdmin};