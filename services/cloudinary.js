const cloudinary = require('cloudinary');


// Configuration 
cloudinary.v2.config({
  cloud_name: "dfzlesl9h",
  api_key: "233941751268995",
  api_secret: "OiXAwJzehQngx37srf8sF1H28gc"
});

module.exports=cloudinary.v2