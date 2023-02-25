var jwt = require('jsonwebtoken');
const { userModel } = require('../DB/model/user.model');

const auth=()=>{

    return async (req,res,next)=>{

        let {token} = req.headers;
        if(!token.startsWith(process.env.authBearerToken)){
            res.json({messgae:"in valid bearer token"});
        }else{
            
          token = token.split(process.env.authBearerToken)[1];
          const decoded = await jwt.verify(token,process.env.loginToken);
          const user = await userModel.findById(decoded.id);
          req.user=user;
          next();
        }
    }
}

module.exports={auth}