//uuidv4 are use foe image unique id
var multer = require('multer')
const {uuid} = require('uuidv4')
var storage = multer.diskStorage({destination:(req,file,path)=>{
    path(null,'public/images')
},
  filename:(req,file,path)=>{
    //path(null,file.originalname)
    //--for save name user
   ////path(null,(req.body.firstname+""+req.body.lastname)+file.originalname.substring(file.originalname.lastIndexOf(".")))
    //note:-file.filename and file,originalname are equal by default
    path(null,uuid()+file.originalname.substring(file.originalname.lastIndexOf(".")))
  }

})

var upload = multer({storage:storage})//key:vale
module.exports = upload;