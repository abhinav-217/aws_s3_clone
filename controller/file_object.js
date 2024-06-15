const fs = require('fs');
const path = require('path');
const {create_file_details} = require("../model/ObjectModel")
const { Readable } = require('stream');
const {verifyToken} = require("../Helpers/Helper")
const {asw_validate_bucket_name} = require("../model/BucketModel");

async function upload_and_create_file(req,res){
    try {
        // Verifying the right token
        let auth_token = verifyToken(req.headers.auth_key ?? "")
        if(!auth_token.is_valid_client) res.status(400).json({status:false,message:"Not valid token"});

        // Processing file and variables
        let {_id,email} = auth_token
        const {bucket_name,desc} = req.body
        let ext = '.'+req.file.originalname.split('.')[1]
        let filename = req.file.originalname.split('.')[0]+Date.now().toString()+ext
        
        // Checking that user has entered valid bucket name
        const is_valid_bucket = await asw_validate_bucket_name(bucket_name,_id)
        if(!is_valid_bucket.status) throw new Error("Bucket Name is not valid")
        
        // Initializing ReadStream
        // Writes data in chunks Whereas fs.writeFileSync writes in one go not suitable for large files
        const readStream = new Readable();
        readStream._read = () => {}; 
        readStream.push(req.file.buffer); 
        readStream.push(null);
        
        // Creating outputPath and Initializing WriteStream
        const outputPath = path.join(process.env.DIR_NAME,_id, bucket_name,filename);
        console.log(outputPath)
        const writeStream = fs.createWriteStream(outputPath); 

        //piping read and write stream
        readStream.pipe(writeStream);

        // entering file details in db when writeStream is successfull
        writeStream.on('finish', async () => {
            let file_details = {
                filename:filename,
                file_url:outputPath,
                ext:ext,
                bucket_name:bucket_name,
                desc:desc
            }
            const result = await create_file_details(file_details)
            delete file_details.file_url
            if(result.status){
                file_details.file_id = result.file_id
                res.status(200).json({status:true,message:"File uploaded successfully",file_details})
            }else{
                throw new Error("Unable to perform operation")
            }
        });

        writeStream.on('error', (err) => {
            console.log(err)
            throw new Error('Failed to save file.:- '+err.message);
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({status:false,message:error.message});
    }
}

module.exports = {upload_and_create_file}