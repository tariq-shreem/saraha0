
const multerValidation = {
    image:['image/jpeg','image/png'],
    pdf:['application/pdf']
}

const multer = require('multer');
const HME = (error,req,res,next)=>{
    if(error){
        res.status(400).json({message:'multer error',error});
    }else{
        next();
    }
}
function myMulter(customvalidation){
    const storage = multer.diskStorage({});

    function fileFilter(req,file,cb){
        if(customvalidation.includes(file.mimetype)){
            cb(null,true)
        }else{
            cb("invalid file type",false);
        }
    }
    const upload = multer({dest:'upload',fileFilter,storage});
    return upload;
}
module.exports={myMulter,HME,multerValidation}