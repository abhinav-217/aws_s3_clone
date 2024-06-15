const {server_file} = require("../model/BucketModel")
const { Readable } = require('stream');
const fs = require("fs")

async function serve_file(req,res){
    const {bucketName,file_id,access_token} = req.query
    if(file_id == undefined || file_id == undefined){
        return res.status(400).json({status:false,message:"Either invalid file id"})
    }
    const path_res = await server_file(bucketName,access_token,file_id)
    console.log(path_res)
    if(path_res.status){
        res.sendFile(path_res.path)
    }else{
        res.sendFile(process.env.NOT_FOUND_DIR)

    }
}

async function stream_file(req,res){
    const {bucketName,file_id} = req.body
    const auth_token = req.headers.auth_key ?? ""
    if(file_id == undefined || bucketName == undefined){
        return res.status(400).json({status:false,message:"Either invalid file id or bucket name"})
    }

}

module.exports = {serve_file, stream_file}