const ObjectSchema = require("../Schemas/ObjectSchema");


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


module.exports = {create_file_details}