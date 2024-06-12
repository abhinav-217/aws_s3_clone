const express = require('express')
const router = express.Router()

const {create_user_bucket} = require('../controller/bucket')

router.route("/").get((req,res)=>{
    res.json({status:true,endpoint:'/bucket/'})
})
router.route("/create_bucket").post(create_user_bucket)

module.exports = router;