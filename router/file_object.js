const express = require('express')
const router = express.Router()
const multer = require('multer');

const {home_res} = require('../controller/file_object')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'temp_uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });



router.route("/upload").post(upload.single('file'),(req,res)=>{
    console.log(req.file)
    const {bucket_name,desc} = req.body
    console.log({bucket_name,desc})
    res.send("Hello")
})

module.exports = router;