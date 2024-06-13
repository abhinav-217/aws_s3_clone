const Client_Bucket = require("../Schemas/Bucket_Schema")
// const make_bucket_folder = require("../Helpers/Helper")  
const fs = require('fs');
const path = require('path');

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

async function asw_create_bucket(bucket_name, user_id, is_public = false) {
    let is_success = true;
    let err = ""
    let savedBucket = []
    const folder_name = `${bucket_name}_${user_id}`;
    const full_path = path.join(DIR_NAME, folder_name);

    try {
        const existing_bucket = await Client_Bucket.findOne({ bucket_name,user_id })
        console.log(existing_bucket)
        if (!existing_bucket) {
            const folder_result = make_bucket_folder(full_path)
            if (folder_result.status) {
                const newBucket = new Client_Bucket({
                    bucket_name: bucket_name,
                    user_id: user_id,
                    is_public: is_public
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

module.exports = { asw_create_bucket }