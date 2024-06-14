const { asw_create_bucket, asw_get_all_buckets } = require("../model/BucketModel")
const {verifyToken} = require("../Helpers/Helper")
async function create_user_bucket(req, res) {
    try {
        console.log(req.body)
        let auth_token = verifyToken(req.headers.auth_key ?? "")
        if(!auth_token.is_valid_client ?? false) throw new Error("Not valid token")
        
        const { bucket_name } = req.body
        const is_public = req.body.is_public ?? false
        const result = await asw_create_bucket(bucket_name, auth_token._id ?? null, is_public)
        console.log(result)
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({ status: false, message: "Something Went wrong" })
    }
}

async function fetch_user_bucket(req,res){
    try {
        let auth_token = verifyToken(req.headers.auth_key ?? "")
        if(!auth_token.is_valid_client ?? false) throw new Error("Not valid token")
        
        const result = await asw_get_all_buckets(auth_token._id ?? null)
        res.status(200).json(result)
    } catch (err) {
        res.status(500).json({status:false, message:"Something Went wrong"})
    }
}


module.exports = { create_user_bucket, fetch_user_bucket }