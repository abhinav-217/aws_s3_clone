const Client_Bucket = require("../Schemas/Bucket_Schema")

const fs = require('fs');
const path = require('path');
const ObjectSchema = require("../Schemas/ObjectSchema");
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
    console.log(arguments)
    let is_success = true;
    let err = ""
    let savedBucket = []
    const folder_name = `${user_id}\\${bucket_name}`;
    const full_path = path.join(DIR_NAME, folder_name);

    try {
        const existing_bucket = await Client_Bucket.findOne({ bucket_name,user_id })
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
    } catch (error) {
        err = error.message
        is_success = false
    } finally {
        let resp_obj = {
            "status": is_success
        }
        if (!is_success) resp_obj.err = err
        if (is_success) resp_obj.data_saved = savedBucket
        return resp_obj
    }
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
    } finally{
        let resp_obj = {
            "status": is_success
        }
        if (!is_success) resp_obj.err = err
        if (is_success) resp_obj.bucket_list = user_bucket_list
        return resp_obj
    }
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
    } finally {
        let resp_obj = {
            "status": is_success
        }
        if (!is_success) resp_obj.err = err
        return resp_obj
    }
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
        console.log(final_path)
    } catch (error) {
        console.log(error)
        err = error.message
        is_success = false
    } finally {
        let resp_obj = {
            status: is_success,
            path:final_path
        }
        if (!is_success) resp_obj.err = err
        return resp_obj
    }
}

module.exports = { asw_create_bucket, asw_get_all_buckets, asw_validate_bucket_name , server_file}