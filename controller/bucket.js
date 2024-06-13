const { asw_create_bucket, asw_get_all_buckets } = require("../model/BucketModel")

async function create_user_bucket(req, res) {
    try {
        console.log(req.body)
        const { bucket_name, user_id } = req.body
        const is_public = req.body.is_public ?? false
        const result = await asw_create_bucket(bucket_name, user_id, is_public)
        console.log(result)
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({ status: false, message: "Something Went wrong" })
    }
}

async function fetch_user_bucket(req,res){
    const user_id = req.query.user_id
    try {
        const result = await asw_get_all_buckets(user_id)
        res.status(200).json(result)
    } catch (err) {
        console.error(err);
        res.status(500).json({status:false, message:"Something Went wrong"})
    }
}


module.exports = { create_user_bucket, fetch_user_bucket }