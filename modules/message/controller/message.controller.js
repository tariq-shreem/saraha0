const { messageModel } = require("../../../DB/model/message.model");
const { userModel } = require("../../../DB/model/user.model");

const sendMessage = async(req,res)=>{

try{

    const {reciverId}=req.params;
    const {message} = req.body;

    const user = await userModel.findById(reciverId);
    if(!user){
        res.json({message:"reciver not found"});
    }else{

        const newMessage = new messageModel({text:message,reciverId});
        const savedMessage = await newMessage.save();
        res.json({message:'success',savedMessage});

    }
}catch(error){
    res.json({message:"catch error",error})
}

}

const messageList = async(req,res)=>{

    const messages = await messageModel.find({reciverId:req.user._id});
    res.json({message:'success',messages});

}

const deleteMessage = async(req,res)=>{

    const {id} = req.params;//message id 
    const userId = req.user._id;
    const message = await messageModel.findOneAndDelete({_id:id,reciverId:userId});
    if(!message){
        res.json({message:'invalid delete message'});
    }else{
        res.json({message:'success'});

    }
}
module.exports={sendMessage,messageList,deleteMessage};