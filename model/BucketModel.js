const Client_Bucket = require("../Schemas/Bucket_Schema")

const fs = require('fs');
const path = require('path');
const ObjectSchema = require("../Schemas/ObjectSchema");
const User = require("../Schemas/User");
const DIR_NAME = process.env.DIR_NAME;

function make_bucket_folder(full_path) {
    try {
        if (!fs.existsSync(full_path)) {
            fs.mkdirSync(full_path, { recursive: true });
            return { status: true, message: "Created Folder" };
        } else {
            return { status: false, message: "Bucket Folder Already Exists" }
        }
    } catch (error) {
        return { status: false, message: error.message }
    }
}

function remove_bucket(full_path){
    if (fs.existsSync(full_path)) {
        fs.rmSync(full_path, { recursive: true, force: true });
    } else {
        //to do 
    }
}

async function asw_create_bucket(bucket_name, user_id, access_token, is_public) {
    let is_success = true;
    let err = ""
    let savedBucket = []
    const folder_name = `${user_id}\\${bucket_name}`;
    const full_path = path.join(DIR_NAME, folder_name);

    try {
        const existing_bucket = await Client_Bucket.findOne({ bucket_name,user_id })
        const user_details = await User.findOne({_id:user_id})
        if(user_details && user_details.access_token == access_token){
            if (!existing_bucket) {
                const folder_result = make_bucket_folder(full_path)
                if (folder_result.status) {
                    const newBucket = new Client_Bucket({
                        bucket_name: bucket_name,
                        user_id: user_id,
                        is_public: is_public,
                        access_token: access_token,
                    });
                    savedBucket = await newBucket.save();
                } else {
                    throw new Error(folder_result.message)
                }
            } else {
                throw new Error("Bucket Name already exists");
            }
        }else{
            throw new Error("Invalid access token")
        }
    } catch (error) {
        err = error.message
        is_success = false
    }
    let resp_obj = {
        "status": is_success
    }
    if (!is_success) resp_obj.err = err
    if (is_success) resp_obj.data_saved = savedBucket
    return resp_obj
    
}

async function asw_get_all_buckets(user_id){
    let err = ""
    let is_success = true
    let user_bucket_list = null
    try {
        const buckets = await Client_Bucket.find({ user_id });
        if(buckets.length){
            user_bucket_list = buckets
        }else{
            throw new Error("No buckets found")
        }
    } catch (error) {
        is_success = false;
        err = error.message
    }
    let resp_obj = {
        "status": is_success
    }
    if (!is_success) resp_obj.err = err
    if (is_success) resp_obj.bucket_list = user_bucket_list
    return resp_obj
    
}

async function asw_validate_bucket_name(bucket_name,user_id){
    let is_success = true;
    let err = ""
    try {
        const existing_bucket = await Client_Bucket.findOne({ bucket_name,user_id })
        if (!existing_bucket) {
            throw new Error("Bucket Name does not exists");
        }
    } catch (error) {
        err = error.message
        is_success = false
    }
    let resp_obj = {
        "status": is_success
    }
    if (!is_success) resp_obj.err = err
    return resp_obj
    
}

async function server_file(bucket_name,access_token,file_id=null){
    let is_success = true;
    let err = ""
    let final_path = null
    try {
        //Checking whether bucket is valid or not 
        const existing_bucket = await Client_Bucket.findOne({ bucket_name,access_token })

        // Checking whether file exists or not with bucket name
        const file_check = await ObjectSchema.findOne({bucket_name:bucket_name,_id:file_id})

        if (!existing_bucket || !file_check) {
            throw new Error("Bucket Name or either file does not exists");
        }
        if(!existing_bucket.is_public)
            throw new Errot("Bucket is not public")

        let user_id = existing_bucket.user_id.toString()
        final_path = path.join(process.env.DIR_NAME,user_id,bucket_name,file_check.filename)
    } catch (error) {
        console.log(error)
        err = error.message
        is_success = false
    }
    let resp_obj = {
        status: is_success,
        path:final_path
    }
    if (!is_success) resp_obj.err = err
    return resp_obj
    
}

async function get_file_details_from_id(file_id){
    let is_success = true
    let err = ""
    let file_details = null
    try {
        file_details = await ObjectSchema.findOne({_id:file_id})
        if(!file_details) is_success = false
    } catch (error) {
        err = error.message
        is_success = false
    }
    let resp_obj = {
        status: is_success,
        file_details:file_details
    }
    if (!is_success) resp_obj.err = err
    return resp_obj
    
}
async function get_bucket_details_from_name(bucket_name,user_id){
    let is_success = true
    let bucket_details = null
    try {
        bucket_details = await Client_Bucket.findOne({bucket_name,user_id})
        if(!bucket_details) is_success = false
    } catch (error) {
        err = error.message
        is_success = false
    }
    let resp_obj = {
        status: is_success,
        bucket_details:bucket_details
    }
    if (!is_success) resp_obj.err = err
    return resp_obj
    
}

async function get_bucket_files(bucket_name,_id){
    let is_success = true
    let files = null
    let err = ""
    try {
        let bucket_details = await Client_Bucket.findOne({bucket_name:bucket_name,user_id:_id})
        if(!bucket_details)
            throw new Error("Bucket name is not valid")
        files = await ObjectSchema.find({bucket_name})
        console.log(files)
        if(files.length==0 || files==null){
            throw new Error("Unable to perform operation")
        }
    }catch (error){
        is_success = false;
        err = error.message
    }
    let resp_obj = {
        status: is_success,
        data:files
    }
    if (!is_success) resp_obj.err = err
    return resp_obj
}

async function delete_bucket(bucket_name,_id){
    let is_success = true
    let err = ""
    try {
        let bucket_details = await Client_Bucket.findOne({bucket_name:bucket_name,user_id:_id})
        if(!bucket_details)
            throw new Error("Bucket Name is not valid")

        const folder_path = path.join(process.env.DIR_NAME, _id, bucket_name)
        fs.rm(folder_path, { recursive: true, force: true }, (err) => {
            if (!err) {
              console.log(`${folder_path} is deleted!`);
            }
        });
        const delete_resp = await Client_Bucket.deleteOne({bucket_name})
        const file_delete_resp = await ObjectSchema.deleteMany({bucket_name})
    }catch (error){
        is_success = false;
        err = error.message
    }
    let resp_obj = {
        status: is_success
    }
    if (!is_success) resp_obj.err = err
    return resp_obj
}

module.exports = { asw_create_bucket, asw_get_all_buckets, asw_validate_bucket_name , server_file, get_file_details_from_id, get_bucket_details_from_name, get_bucket_files, delete_bucket}