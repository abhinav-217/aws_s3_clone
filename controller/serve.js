const {server_file} = require("../model/BucketModel")
const { Readable } = require('stream');
const fs = require("fs")
const {get_file_details_from_id,get_bucket_details_from_name} = require("../model/BucketModel")
const {verifyToken} = require("../Helpers/Helper")
const path = require("path")

function  create_read_stream(filePath) {
    const readStream = new Readable();
    readStream._read = () => {}; 
    const fileStream = fs.createReadStream(filePath);
    
    fileStream.on('data', (chunk) => {
        readStream.push(chunk); 
        // console.log(chunk)
    });
    
    fileStream.on('end', () => {
        readStream.push(null); 
    });
 
    return readStream;
}

async function serve_file(req,res){
    const {bucketName,file_id,access_token} = req.query
    console.log(bucketName,file_id)
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
    try {
        const {bucket_name,file_id} = req.body
        console.log(bucket_name,file_id)
        let auth_token = verifyToken(req.headers.auth_key ?? "")
        if(!auth_token.is_valid_client) res.status(400).json({status:false,message:"Not valid token"});
        if(file_id == undefined || bucket_name == undefined){
            return res.status(400).json({status:false,message:"Either invalid file id or bucket name"})
        }

        let {_id,email} = auth_token
        let file_resp = await get_file_details_from_id(file_id)
        let bucket_resp = await get_bucket_details_from_name(bucket_name)
        
        if(file_resp.status && bucket_resp.status){
            let file_details = file_resp.file_details
            let bucket_details = bucket_resp.bucket_details
            if(bucket_details.user_id.toString() != _id) 
                throw new Error("Bucket name is invalid")
            if(file_details.bucket_name != bucket_name) 
                throw new Error("File should belong to the given bucket name")
            res.set({
                'Content-Disposition': `inline; filename="${file_id}"`,
                'Content-Type': 'application/octet-stream',
            });
            let fileStream = fs.createReadStream(file_details.file_url)
            console.log(fileStream)
            fileStream.pipe(res);
            fileStream.on('error', (err) => {
                console.error(`Error reading file`);
                res.status(500).send(`Error reading file ${file_details.filename}`);
            });
            fileStream.on('end', () => {
                console.log(`File streamed successfully`);
                res.end();
            });
        }else{
            throw new Error("Invalid Request")
        }
    } catch (error) {
        res.status(400).json({status:false,message:error.message})
    }
    

}

module.exports = {serve_file, stream_file}