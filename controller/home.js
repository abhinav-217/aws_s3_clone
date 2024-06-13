const {register_client,login_client} = require("../model/UserModel")
async function register_user(req,res){
    const {user_name,email,password} = req.body
    if(!user_name || !email || !password){
        res.status(400).json({status:false,msg:"Please enter valid credentials"})
    }else{
        const user = await register_client(user_name,email,password)
        res.status(200).json(user)
    }
}
async function login_user(req,res){
    const {email,password} = req.body
    if(!email || !password){
        res.status(400).json({status:false,msg:"Please enter valid credentials"})
    }else{
        const result = await login_client(email,password)
        res.status(200).json(result)
    }
}
module.exports = {register_user, login_user}