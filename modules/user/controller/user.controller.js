const { userModel } = require("../../../DB/model/user.model");
let bcrypt = require('bcryptjs');
const cloudinary  = require("../../../services/cloudinary");


const updatePassword = async(req,res)=>{
    try{
        const {oldPassword,newPassword} = req.body;
        const user = await userModel.findById(req.user._id);
        const match = await bcrypt.compare(oldPassword,user.password);
        if(!match){
            res.json({message:'old password invalid'});
        }else{

           const hash = await bcrypt.hash(newPassword,parseInt(process.env.SaltRound));
           const updateUser = await userModel.findByIdAndUpdate(req.user._id,{password:hash});
           if(!updateUser){
            res.json({message:'fail update password'});
           }else{
            res.json({message:'success'});
           }
        }
    }catch(error){
        res.json({message:'catch error',error})
    }
}

const uploadProfilePic = async(req,res)=>{
    if(!req.file){
        res.status(400).json({message:"plz upload image"});
    }else{

        const {secure_url} =await cloudinary.uploader.upload(req.file.path,{
            folder:`user/profile/${req.user._id}`
        });
    await userModel.findOneAndUpdate({_id:req.user._id},{profilePic:secure_url});
  res.status(200).json({message:'success',secure_url});
}
}

module.exports={updatePassword,uploadProfilePic}