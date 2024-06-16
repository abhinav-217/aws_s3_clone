const {register_client,login_client, update_access_token} = require("../model/UserModel")
const {verifyToken} = require("../Helpers/Helper")
const { verify } = require("jsonwebtoken")
const {v4} =  require('uuid')
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

async function generate_key(req,res){
    try {
        let auth_token = req.headers.auth_key ?? ""
        //Checking auth token
        const auth_details = verifyToken(auth_token)
        if(!auth_details.is_valid_client) 
            throw new Error("Not valid token")
        
        let {_id,email} = auth_details
        let access_token = v4()
        const update_res = await update_access_token(access_token,email,_id)

        if(!update_res) 
            throw new Error("Unable to perform operation")
        res.json({status:true,access_token})
    } catch (error) {
        res.status(500).json({status:false,message:error.message})
    }
}
module.exports = {register_user, login_user, generate_key}