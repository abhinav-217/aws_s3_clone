const {asw_create_bucket} = require("../model/BucketModel")

async function create_user_bucket(req,res){
    console.log(req.body)
    const {bucket_name,user_id} = req.body
    const is_public = req.body.is_public ?? false
    const result = await asw_create_bucket(bucket_name,user_id,is_public)
    console.log(result)
    res.status(200).json(result)
}

module.exports = {create_user_bucket}