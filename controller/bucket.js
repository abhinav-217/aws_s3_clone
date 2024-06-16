const { asw_create_bucket, asw_get_all_buckets, get_bucket_files, delete_bucket } = require("../model/BucketModel")
const {verifyToken} = require("../Helpers/Helper")
async function create_user_bucket(req, res) {
    try {
        console.log(req.body)
        let auth_token = verifyToken(req.headers.auth_key ?? "")
        if(!auth_token.is_valid_client ?? false) 
            throw new Error("Not valid token")
        
        const { bucket_name,access_token } = req.body
        const is_public = req.body.is_public ?? false
        const result = await asw_create_bucket(bucket_name, auth_token._id ?? null,access_token, is_public)

        console.log(result)
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({ status: false, message: "Something Went wrong" })
    }
}

async function fetch_user_bucket(req,res){
    try {
        let auth_token = verifyToken(req.headers.auth_key ?? "")
        if(!auth_token.is_valid_client ?? false) 
            throw new Error("Not valid token")
        
        const result = await asw_get_all_buckets(auth_token._id ?? null)
        res.status(200).json(result)
    } catch (err) {
        res.status(500).json({status:false, message:"Something Went wrong"})
    }
}

async function get_bucket_docs(req,res){
    try {
        let auth_token = verifyToken(req.headers.auth_key ?? "")
        if(!auth_token.is_valid_client ?? false) 
            throw new Error("Not valid token")
        let {_id,email} = auth_token
        const {bucket_name} = req.body
        let bucket_details = await get_bucket_files(bucket_name,_id) 
        res.status(200).json(bucket_details)
    } catch (error) {
        res.status(500).json({status:false, message:error.message})
    }
}
async function delete_bucket_ctrl(req,res){
    try {
        let auth_token = verifyToken(req.headers.auth_key ?? "")
        if(!auth_token.is_valid_client ?? false) 
            throw new Error("Not valid token")
        let {_id,email} = auth_token
        const {bucket_name} = req.body
        let bucket_details = await delete_bucket(bucket_name,_id) 
        res.status(200).json(bucket_details)
    } catch (error) {
        res.status(500).json({status:false, message:error.message})
    }
}
module.exports = { create_user_bucket, fetch_user_bucket, get_bucket_docs, delete_bucket_ctrl }