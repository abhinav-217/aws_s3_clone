async function create_user_bucket(req,res){
    res.status(200).json({status:true,message:"Creation success"})
}

module.exports = {create_user_bucket}