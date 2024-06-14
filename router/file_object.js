const express = require('express')
const router = express.Router()
const multer = require('multer');
const {upload_and_create_file} = require('../controller/file_object')

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, 'temp_uploads/');
//     },
//     filename: (req, file, cb) => {
//       cb(null, file.originalname);
//     }
// });
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });
router.route("/upload").post(upload.single('file'),upload_and_create_file)

module.exports = router;