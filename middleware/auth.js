const jwt = require('jsonwebtoken');
const {resMessage} = require('./respond.js');
const {login} = require('../controllers/users.controller')

const auth = (req, res, next) => {
    try{    
        const head = req.headers.authorization;
        if(!head || !head.startsWith("Bearer"))
            return login(req, res, next);
        const token = head.split(" ")[1];
    
        const decode = jwt.verify(token, process.env.jwt_code);
        //decode here will belike {name: ****, email: *****, role: ****, expiresIn...}
        if(decode.role === "admin"){
            req.user = req.body;
            next();
            return;
        }
        req.user = decode;
        next();
    } catch(e) {
        return resMessage(res, 401, "authentication failed!");
    }
}

const authAdmine = (req, res, next) => {
    try{
        const head = req.headers.authorization;
        if(!head || !head.startsWith("Bearer"))
            return login(req, res, next);
        const token = head.split(" ")[1];
        
        const decode = jwt.verify(token, process.env.jwt_code);
        if(decode.role !== "admin")
            return resMessage(res, 401, "only admin!");
        if(!req.body)
            req.user = req.body;
        next();
    } catch(e) {
        return resMessage(res, 500, "authentication admin failed!")
    }
}
module.exports = {auth, authAdmine}