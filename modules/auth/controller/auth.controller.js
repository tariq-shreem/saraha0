const { userModel } = require("../../../DB/model/user.model");
let bcrypt = require('bcryptjs');
const { sendEamil } = require("../../../services/email");
var jwt = require('jsonwebtoken');
const { nanoid } = require('nanoid');
var QRCode = require('qrcode')

const signup = async(req,res)=>{
    try{

  
    const {name,email,password} = req.body;
    const user = await userModel.findOne({email});
    if(user){
        res.status(409).json({messgae:"email exist"});
    }else{
        let hashPassword = await bcrypt.hash(password,parseInt(process.env.SaltRound));
        const newUser = new userModel({email,userName:name,password:hashPassword});
        const savedUser = await newUser.save();
        if(!savedUser){
            res.status(400).json({message:"fail to signup"});
        }else{
            let token=await jwt.sign({id:savedUser._id},process.env.CONFIRMEMAILTOKEN,{expiresIn:'1h'})
let refreshToken=await jwt.sign({id:savedUser._id},process.env.refreshTokenEmail)
            
            let message = `
                <a href="${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/confirmEmail/${token}">verify email</a>
            `;

            let messageRefresh = `
            <a href="${req.protocol}://${req.headers.host}/${process.env.BASEURL}/auth/rftoken/${refreshToken}">Resend verify email</a>
        `;
          let emaild= await sendEamil(email,'confirm Email',`${message} <br /> ${messageRefresh}`);
          res.status(201).json({message:"success"});
        }
    }
}catch(error){
    res.status(500).json({message:'catch error',error});
}
}

const confirmEmail=async(req,res)=>{
try{
    const {token} = req.params;
    const decoded = jwt.verify(token,process.env.CONFIRMEMAILTOKEN);
    if(!decoded){
        res.json({message:"invalid token payload"});

    }else{
        let user = await userModel.findByIdAndUpdate(
            {_id:decoded.id,confirmEmail:false},
            {confirmEmail:true}
            );
        res.json({message:"your email is confirmed"});
    }
 
}catch(error){
    res.json({message:"error",error});
}
}

const signin= async(req,res)=>{
    const {email,password} = req.body;
    const user = await userModel.findOne({email});
    if(!user){
        res.json({message:'invalid account'});
    }else{
        if(!user.confirmEmail){
            res.json({message:"plz verify your email"});
        }else{ 
            const match = await bcrypt.compare(password,user.password);
            if(!match){
                res.json({message:'invalid account'});
            }else{
                const token = jwt.sign({id:user._id},process.env.loginToken,{expiresIn:60*60*24});
                res.json({message:'success',token});
            }
        }
    }
}


const sendCode = async(req,res)=>{

    const {email} = req.body;
    const user = await userModel.findOne({email}).select('email');
    if(!user){
        res.json({message:'invalid account'});
    }else{
        const code = nanoid();
       await sendEamil(email,'Forget Password',`verify code : ${code}`);
       
       const updateUser = await userModel.updateOne({_id:user._id},{sendCode:code});
        if(!updateUser){
            res.json({message:"invalid"});
        }else{
            res.json({message:"success"});
        }
    }

}

const forgetPassword = async(req,res)=>{

    const {code,email,newPassword} = req.body;
    if(code==null){
        res.json({message:'fail'});
    }else{
        const hash = await bcrypt.hash(newPassword,parseInt(process.env.SaltRound));
        const user = await userModel.findOneAndUpdate({email,sendCode:code},{password:hash,sendCode:null});
    
        if(!user){
            res.json({message:'fail'});
        }else{
            res.json({message:"success"});
        }
    }
   

}

const refreshtoken = async(req,res)=>{

    const {token} = req.params;
    const decoded = jwt.verify(token,process.env.refreshTokenEmail);
   if(!decoded?.id){
    res.json({message:"i-valid token payload"});
   }else{

    const user = await userModel.findById(decoded.id).select('email');
    if(!user){
        res.json({messgae:'not registerd account'});
    }else{

        let token=await jwt.sign({id:user._id},process.env.CONFIRMEMAILTOKEN,{expiresIn:60 * 5});
        let message = `
        <a href="${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/confirmEmail/${token}">verify email</a>
    `;
    await sendEamil(user.email,'confirm Email',message);
    res.status(201).json({messgae:"success"});


    }

   }

     
}

const qrcodeAllUser = async(req,res)=>{
    let link = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/getAllUsers`
    QRCode.toDataURL(link, function (err, url) {
       res.json(url);
      })
}

const getAllUsers=async(req,res)=>{
 
    let users =await userModel.find({});
    res.json(users);
}
module.exports={getAllUsers,signup,confirmEmail,signin,sendCode,forgetPassword,refreshtoken,qrcodeAllUser};
