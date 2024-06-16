const ObjectSchema = require("../Schemas/ObjectSchema");
const Client_Bucket = require("../Schemas/Bucket_Schema")
const path = require("path")
const fs = require("fs")
async function create_file_details(file_details){
    try {
        const object = new ObjectSchema(file_details);
        const savedObject = await object.save();
        return {status:true,file_id:savedObject._id.toString()};
    } catch (error) {
        console.error("Error saving object details:", error);
        throw error;
    }
}

async function delete_file(bucket_name,_id,file_id){
    let is_success = true
    let err = ""
    try {
        let bucket_details = await Client_Bucket.findOne({bucket_name:bucket_name,user_id:_id})
        let file_details = await ObjectSchema.findOne({_id:file_id})
        console.log(bucket_details)
        console.log(file_details)
        if(!bucket_details)
            throw new Error("Bucket Name is not valid")
        if(!file_details)
            throw new Error("Not valid file information")

        const file_delete_resp = await ObjectSchema.deleteOne({_id:file_id})
        console.log(file_delete_resp)

        if(file_delete_resp.deletedCount === 0)
            throw new Error("Unable to delete file form db")
        const file_path = path.join(process.env.DIR_NAME, _id, bucket_name, file_details.filename)
        console.log(file_path)
        fs.rm(file_path, { recursive: true, force: true }, async (err) => {
            if (err) {
                const insert_backup = new ObjectSchema(file_details)
                await insert_backup.save()
                throw new Error("Unable to delete file")
            }
        });
        
    }catch (error){
        is_success = false;
        err = error.message
    }
    let resp_obj = {
        status: is_success
    }
    if (!is_success) resp_obj.err = err
    if (!is_success) resp_obj.message = "File delete permanently"
    return resp_obj
}
module.exports = {create_file_details, delete_file}