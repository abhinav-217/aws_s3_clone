const fs = require('fs');
const path = require('path');

const DIR_NAME = process.env.DIR_NAME;

function make_bucket_folder(user_id, bucket_name) {
    const folder_name = `${bucket_name}_${user_id}`;
    const full_path = path.join(DIR_NAME, folder_name);

    if (!fs.existsSync(full_path)) {
        fs.mkdirSync(full_path, { recursive: true });
        console.log(`Folder created: ${full_path}`);
    } else {
        console.log(`Folder already exists: ${full_path}`);
    }
    
    return true;
}
module.exports = {make_bucket_folder}